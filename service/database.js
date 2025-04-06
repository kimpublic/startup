// database.js
const { MongoClient } = require('mongodb');
const { getParameterValue } = require('./paramStore'); 


let client;
let db;


// Param Store에서 dbConfig 3개 값 가져와 MongoDB 연결
(async function initDB() {
    try {
        // 1) 세 개 파라미터를 각각 불러옴
        const userName = await getParameterValue('/myapp/dbConfig-userName');
        const password = await getParameterValue('/myapp/dbConfig-password');
        const hostname = await getParameterValue('/myapp/dbConfig-hostname');
    
        // 2) 유효성 검사
        if (!userName || !password || !hostname) {
          console.error('❌ Missing some dbConfig param in Param Store!');
          process.exit(1);
        }
    
        // 3) MongoDB 접속 URL 구성
        const url = `mongodb+srv://${userName}:${password}@${hostname}`;
    
        // 4) MongoClient 생성 & 연결 테스트
        client = new MongoClient(url);
        db = client.db('squidgame');
    
        await db.command({ ping: 1 });
        console.log('✅ Connected to MongoDB (Param Store)!');
    } catch (ex) {
        console.log(`❌ Unable to connect to database. ${ex.message}`);
        process.exit(1);
    }
})();
     
// userCollection을 안전하게 가져오는 헬퍼 함수
function getUserCollection() {
    if (!db) {
        throw new Error('Database not initialized yet!');
    }
    return db.collection('users');
}
     
// 🔹 이메일로 사용자 찾기
function getUser(email) {
    return getUserCollection().findOne({ email });
}
    
// 🔹 사용자 추가
async function addUser(user) {
    await getUserCollection().insertOne(user);
}

// 🔹 사용자 업데이트 (닉네임, 점수 등)
async function updateUser(user) {
  await getUserCollection().updateOne(
    { email: user.email },
    { $set: user }
  );
}

// 🔹 Defeats TOP 10 (frontmanDefeats 기준)
async function getTopDefeats() {
  const query = { frontmanDefeats: { $gt: 0 } };
  const options = {
    sort: { frontmanDefeats: -1 },
    limit: 10,
  };
  return getUserCollection().find(query, options).toArray();
}

// 🔹 Invites TOP 10 (friendInvites 기준)
async function getTopInvites() {
  const query = { friendInvites: { $gt: 0 } };
  const options = {
    sort: { friendInvites: -1 },
    limit: 10,
  };
  return getUserCollection().find(query, options).toArray();
}

module.exports = {
  getUser,
  addUser,
  updateUser,
  getTopDefeats,
  getTopInvites,
};
