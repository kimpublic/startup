const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');
const { getParameterValue } = require('./paramStore');
const nodemailer = require('nodemailer');


const {
  getUser,
  addUser,
  updateUser,
  getTopDefeats,
  getTopInvites
} = require('./database.js');

require('dotenv').config();

// Express 서버 설정
const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const authCookieName = 'authToken';


const allowedOrigins = [
  'http://localhost:5173',
  'https://startup.rockpaperscissorsminusone.link',
  'https://www.startup.rockpaperscissorsminusone.link',
];




// ✅ CORS 설정 추가
app.use(cors({
  origin: allowedOrigins, // 
  credentials: true // 쿠키 포함 허용
}));

app.options('*', cors());

app.use(express.json());
app.use(cookieParser());



// Improved static file serving with proper MIME types
app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Handle SPA routing
app.get('*', (req, res, next) => {
  // Skip API routes and direct file requests
  if (req.path.startsWith('/api') || req.path.includes('.')) {
    return next();
  }
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

async function initParameters() {
  console.log('🔍 Fetching AWS Parameter Store values...');
  process.env.EMAIL_USER = await getParameterValue('/myapp/EMAIL_USER');
  process.env.EMAIL_PASS = await getParameterValue('/myapp/EMAIL_PASS');
  process.env.SECRET_KEY = await getParameterValue('/myapp/SECRET_KEY');
  console.log('✅ Parameter Store values loaded!');
  console.log('🔍 EMAIL_USER:', process.env.EMAIL_USER);
  console.log('🔍 EMAIL_PASS:', process.env.EMAIL_PASS ? 'LOADED' : 'MISSING'); // 비밀번호는 보안 때문에 직접 표시 안 함
  console.log('🔍 SECRET_KEY:', process.env.SECRET_KEY);
}


(async () => {
  console.log('Fetching AWS Parameters...');
  const emailUser = await getParameterValue('/myapp/EMAIL_USER');
  const emailPass = await getParameterValue('/myapp/EMAIL_PASS');
  const secretKey = await getParameterValue('/myapp/SECRET_KEY');

  console.log('EMAIL_USER:', emailUser);
  console.log('EMAIL_PASS:', emailPass ? 'LOADED' : 'MISSING'); // 보안상 직접 표시 X
  console.log('SECRET_KEY:', secretKey);
})();

async function startServer() {
  await initParameters();

  console.log('🔍 환경 변수 확인:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'LOADED' : 'MISSING'); 
  console.log('SECRET_KEY:', process.env.SECRET_KEY);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ 환경 변수가 로드되지 않았습니다! 서버를 시작할 수 없습니다.');
      process.exit(1); // 서버 실행 중지
  }

  const SECRET_KEY = process.env.SECRET_KEY;

  
  app.get('/api/scores/defeats', async (req, res) => {
    try {
      const defeatRanking = await getTopDefeats(); 
      const responseData = defeatRanking.map(user => ({
        name: user.nickName || user.email,
        score: user.frontmanDefeats,
      }));

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching defeat scores:', error);
        res.status(500).send({ msg: 'Failed to fetch defeat scores' });
    }
});


app.get('/api/scores/invites', async (req, res) => {
    try {
        const inviteRanking = await getTopInvites(); 
        const responseData = inviteRanking.map(user => ({
          name: user.nickName || user.email,
          score: user.friendInvites,
        }));

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching invite scores:', error);
        res.status(500).send({ msg: 'Failed to fetch invite scores' });
    }
});
  
app.post('/api/scores/defeats', async (req, res) => {
  
    const token = req.cookies[authCookieName];
    if (!token) return res.status(401).send({ msg: 'Unauthorized' });

    try {
        const { email } = jwt.verify(token, SECRET_KEY);
        const user = await getUser(email); // DB 조회
        if (!user) return res.status(404).send({ msg: 'User not found' });
        user.frontmanDefeats = (user.frontmanDefeats || 0) + 1;
        user.canInvite = true;

        await updateUser(user); 

        res.send({
            email: user.email,
            nickName: user.nickName,
            frontmanDefeats: user.frontmanDefeats,
            friendInvites: user.friendInvites,
            canInvite: user.canInvite
        });

    } catch (error) {
        res.status(401).send({ msg: 'Unauthorized: Invalid token' });
    }
});

  
app.post('/api/scores/invites', async (req, res) => {
    const token = req.cookies[authCookieName];
    if (!token) return res.status(401).send({ msg: 'Unauthorized' });

    try {
        const { email } = jwt.verify(token, SECRET_KEY);
        const user = await getUser(email); // DB에서 찾기
        if (!user) return res.status(404).send({ msg: 'User not found' });

        user.friendInvites = (user.friendInvites || 0) + 1;
        user.canInvite = false; // 초대 후 다시 초대 불가
        await updateUser(user); // DB 업데이트

        res.send({
            email: user.email,
            nickName: user.nickName,
            frontmanDefeats: user.frontmanDefeats,
            friendInvites: user.friendInvites,
            canInvite: user.canInvite
        });

    } catch (error) {
        res.status(401).send({ msg: 'Unauthorized: Invalid token' });
    }
});

  
  

// ✅ 회원가입 (Create User)
app.post('/api/auth/create', async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await getUser(email);
  if (existingUser) {
    return res.status(409).send({ msg: 'Existing user' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    email,
    password: hashedPassword,
    nickName: '',
    frontmanDefeats: 0,
    friendInvites: 0,
    canInvite: false
  };
  await addUser(newUser);

  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
  res.cookie(authCookieName, token, { httpOnly: true, secure: true, sameSite: 'strict' });

  res.send({
    email: newUser.email,
    nickName: newUser.nickName,
    frontmanDefeats: newUser.frontmanDefeats,
    friendInvites: newUser.friendInvites
  });
});

// ✅ 로그인 (Authenticate User)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await getUser(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send({ msg: 'Unauthorized: Check your email or password' });
  }

  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
  res.cookie(authCookieName, token, { httpOnly: true, secure: true, sameSite: 'strict' });

  res.send({
    email: user.email,
    nickName: user.nickName,
    frontmanDefeats: user.frontmanDefeats,
    friendInvites: user.friendInvites
  });

});

// ✅ 로그아웃 (Logout User)
app.delete('/api/auth/logout', (req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// ✅ 닉네임 변경 (Update Nickname)
app.post('/api/user/nickname', async (req, res) => {
  const token = req.cookies[authCookieName];
  if (!token || typeof token !== 'string') {
    return res.status(401).send({ msg: 'Unauthorized: No token provided' });
  }

  try {
    const { email } = jwt.verify(token, SECRET_KEY);
    const user = await getUser(email);
    if (!user) return res.status(404).send({ msg: 'User not found' });

    const { nickName } = req.body;
    if (!nickName || nickName.trim().length === 0) {
      return res.status(400).send({ msg: 'Nickname is required and cannot be empty' });
    }

    user.nickName = nickName.trim();
    await updateUser(user);

    res.send({
      email: user.email,
      nickName: user.nickName,
      frontmanDefeats: user.frontmanDefeats,
      friendInvites: user.friendInvites
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ msg: 'Unauthorized: Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ msg: 'Unauthorized: Invalid token' });
    }
    return res.status(401).send({ msg: 'Unauthorized: Token verification failed' });
  }
});



app.get('/api/user/stats', async (req, res) => {
  const token = req.cookies[authCookieName];
  if (!token) return res.status(401).send({ msg: 'Unauthorized' });

  try {
    const { email } = jwt.verify(token, SECRET_KEY);
    const user = await getUser(email);
    if (!user) return res.status(404).send({ msg: 'User not found' });

    res.send({
      nickName: user.nickName || 'Guest',
      frontmanDefeats: user.frontmanDefeats || 0,
      friendInvites: user.friendInvites || 0,
      canInvite: user.canInvite || false,
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ msg: 'Unauthorized: Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ msg: 'Unauthorized: Invalid token' });
    }
    return res.status(401).send({ msg: 'Unauthorized: Token verification failed' });
  }
});


// ✅ 이메일 전송 제한 설정 (5분 동안 최대 10개)
const EMAIL_LIMIT = 10;
const TIME_FRAME = 5 * 60 * 1000; // 5분 (밀리초)

// ✅ 이메일 전송 기록 저장 (서버 메모리 사용)
const emailLogs = {};

app.options('/send-email', (req, res) => {
  
  res.sendStatus(204);
});


app.post('/send-email', async (req, res) => {
    console.log('📩 Email API received a request!');
    
  console.log('📌 Checking environment variables...');
  console.log('✅ EMAIL_USER:', process.env.EMAIL_USER);
  console.log('✅ EMAIL_PASS:', process.env.EMAIL_PASS ? 'LOADED' : 'MISSING');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ EMAIL_USER 또는 EMAIL_PASS가 설정되지 않았습니다.');
      return res.status(500).json({ msg: 'Server email configuration is missing.' });
  }

  console.log('✅ 요청 바디:', req.body); // << 여기까지 나오면 요청은 정상적으로 도착한 것

    const userIp = req.ip; // 유저 식별 (IP 기준)
    const now = Date.now();

    const token = req.cookies[authCookieName]; // ✅ 유저 인증을 위해 쿠키에서 토큰 가져오기
    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized: No token provided' });
    }

    if (!emailLogs[userIp]) {
        emailLogs[userIp] = [];
    }

    const { email } = jwt.verify(token, SECRET_KEY);
    const user = await getUser(email);
      if (!user) {
          return res.status(404).json({ msg: 'User not found' });
      }

    console.log(`✅ User ${user.nickName} (${user.email}) is sending an invitation`);

    // ✅ 5분이 지난 이메일 로그 삭제
    emailLogs[userIp] = emailLogs[userIp].filter(timestamp => now - timestamp < TIME_FRAME);

    if (emailLogs[userIp].length >= EMAIL_LIMIT) {
        return res.status(429).json({ 
            msg: 'The server is currently experiencing a high volume of requests. Please try again later.', 
            
        });
    }

    // ✅ 이메일 전송 기록 추가
    emailLogs[userIp].push(now);

    // 📩 Nodemailer 이메일 전송
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS 
        }
    });

    const { to, name } = req.body;

    // ✅ 이메일 내용 구성
    const mailOptions = {
      from: `"Squid Game Invitation" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `${user.nickName || 'Your Friend'} invited you to Game!`,
      html: `
          <h2>You've been invited to play!</h2>
          <p>Dear ${name || 'Friend'},</p>
          <p>Your friend <strong>${user.nickName}</strong> has invited you to join the Squid Game challenge.</p>
          <p>Click the link below to accept the invitation:</p>
          <a href="https://startup.rockpaperscissorsminusone.link/">Join the Game</a>
          <p>See you in the arena!</p>
          <br />
          <p>(This email is sent as a part of Minjoong's CS260 project)</p>
          <br />
          <p>Best regards,</p>
          <p>Game Maker Minjoong Kim</p>
      `
  };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ msg: 'Failed to send invitation email', error });
        }
        console.log(`✅ 메일 전송 성공!`);
        console.log(`   - 수신자: ${mailOptions.to}`);
        console.log(`   - 메시지 ID: ${info.messageId}`);
        console.log(`   - SMTP 응답: ${info.response}`);
        res.json({ msg: 'Invitation sent successfully!'});
    });
});


app.listen(port, () => {
console.log(`Listening on port ${port}`);
});
}


// ✅ 서버 시작
startServer().catch(err => {
  console.error('❌ Failed to start server:', err);
});
