const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const authCookieName = 'authToken';
const SECRET_KEY = 'your-secret-key'; // JWT 서명 키 (실제 서비스에서는 환경변수로 설정해야 함)

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

let users = [
    // 예제 데이터
    // { email: 'test@test.com', password: 'hashedPw', nickName: 'Player1', frontmanDefeats: 3, friendInvites: 2 }
  ];
  
  app.get('/api/scores/defeats', (req, res) => {
    try {
        const defeatRanking = users
            .filter(user => user.frontmanDefeats > 0) // 0점인 유저 제외
            .map(user => ({
                name: user.nickName || user.email, 
                score: user.frontmanDefeats
            }))
            .sort((a, b) => b.score - a.score) 
            .slice(0, 10);

        res.json(defeatRanking);
    } catch (error) {
        console.error('Error fetching defeat scores:', error);
        res.status(500).send({ msg: 'Failed to fetch defeat scores' });
    }
});


app.get('/api/scores/invites', (req, res) => {
    try {
        const inviteRanking = users
            .filter(user => user.friendInvites > 0) // 0점인 유저 제외
            .map(user => ({
                name: user.nickName || user.email,
                score: user.friendInvites
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        res.json(inviteRanking);
    } catch (error) {
        console.error('Error fetching invite scores:', error);
        res.status(500).send({ msg: 'Failed to fetch invite scores' });
    }
});


  
app.post('/api/scores/defeats', (req, res) => {
    const token = req.cookies[authCookieName];
    if (!token) return res.status(401).send({ msg: 'Unauthorized' });

    try {
        const { email } = jwt.verify(token, SECRET_KEY);
        const user = users.find(u => u.email === email);
        if (!user) return res.status(404).send({ msg: 'User not found' });

        user.frontmanDefeats += 1;
        user.canInvite = true;

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

  
app.post('/api/scores/invites', (req, res) => {
    const token = req.cookies[authCookieName];
    if (!token) return res.status(401).send({ msg: 'Unauthorized' });

    try {
        const { email } = jwt.verify(token, SECRET_KEY);
        const user = users.find(u => u.email === email);
        if (!user) return res.status(404).send({ msg: 'User not found' });

        user.friendInvites += 1;
        user.canInvite = false; // 초대 후 다시 초대 불가

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

  if (users.find((user) => user.email === email)) {
    return res.status(409).send({ msg: 'Existing user' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { email, password: hashedPassword, nickName: '', frontmanDefeats: 0, friendInvites: 0, canInvite: false };
  users.push(newUser);

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
  const user = users.find((u) => u.email === email);

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
app.post('/api/user/nickname', (req, res) => {
    const token = req.cookies[authCookieName];
  
    // ✅ 토큰이 없거나 잘못된 타입일 경우 예외 처리
    if (!token || typeof token !== 'string') {
      return res.status(401).send({ msg: 'Unauthorized: No token provided' });
    }
  
    try {
      const { email } = jwt.verify(token, SECRET_KEY);
      const user = users.find((u) => u.email === email);
  
      if (!user) {
        return res.status(404).send({ msg: 'User not found' });
      }
  
      // ✅ 닉네임 검증 (공백 문자열도 예외 처리)
      const { nickName } = req.body;
      if (!nickName || nickName.trim().length === 0) {
        return res.status(400).send({ msg: 'Nickname is required and cannot be empty' });
      }
  
      user.nickName = nickName.trim(); // 앞뒤 공백 제거 후 저장
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



app.get('/api/user/stats', (req, res) => {
const token = req.cookies[authCookieName];
if (!token) return res.status(401).send({ msg: 'Unauthorized' });

try {
    const { email } = jwt.verify(token, SECRET_KEY);
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(404).send({ msg: 'User not found' });

    console.log('닉네임 호출 완료:', user);

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

app.post('/api/scores/defeats', (req, res) => {
    const token = req.cookies[authCookieName];
    if (!token) return res.status(401).send({ msg: 'Unauthorized' });
  
    try {
      const { email } = jwt.verify(token, SECRET_KEY);
      const user = users.find((u) => u.email === email);
      if (!user) return res.status(404).send({ msg: 'User not found' });
  
      user.frontmanDefeats = (user.frontmanDefeats || 0) + 1;
      user.canInvite = true; // 승리 후 초대 가능

      res.send({
        email: user.email,
        nickName: user.nickName,
        frontmanDefeats: user.frontmanDefeats,
        friendInvites: user.friendInvites,
        canInvite: user.canInvite
      });
      
    
    } catch (error) {
      res.status(401).send({ msg: 'Invalid token' });
    }
  });

  
app.post('/api/scores/invites', (req, res) => {
const token = req.cookies[authCookieName];
if (!token) return res.status(401).send({ msg: 'Unauthorized' });

try {
    const { email } = jwt.verify(token, SECRET_KEY);
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(404).send({ msg: 'User not found' });

    user.friendInvites = (user.friendInvites || 0) + 1;
    user.canInvite = false; // 초대 후 다시 초대 불가하도록 설정정
    res.send({
        email: user.email,
        nickName: user.nickName,
        frontmanDefeats: user.frontmanDefeats,
        friendInvites: user.friendInvites
      });



// ✅ 프론트맨 격파 랭킹 조회 (상위 10명 반환)
app.get('/api/scores/defeats', (req, res) => {
    try {
        const defeatRanking = users
            .map((user) => ({
                name: user.nickName || user.email, // 닉네임 없으면 이메일 표시
                score: user.frontmanDefeats || 0
            }))
            .sort((a, b) => b.score - a.score) // 내림차순 정렬
            .slice(0, 10); // 상위 10명만 반환

        res.json(defeatRanking);
    } catch (error) {
        console.error('Error fetching defeat scores:', error);
        res.status(500).send({ msg: 'Failed to fetch defeat scores' });
    }
});

// ✅ 초대 횟수 랭킹 조회 (상위 10명 반환)
app.get('/api/scores/invites', (req, res) => {
    try {
        const inviteRanking = users
            .map((user) => ({
                name: user.nickName || user.email,
                score: user.friendInvites || 0
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        res.json(inviteRanking);
    } catch (error) {
        console.error('Error fetching invite scores:', error);
        res.status(500).send({ msg: 'Failed to fetch invite scores' });
    }
});

      
    
} catch (error) {
    res.status(401).send({ msg: 'Invalid token' });
}
});
  
  
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
