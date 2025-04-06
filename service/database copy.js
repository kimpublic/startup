// database.js
const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('squidgame');         
const userCollection = db.collection('users'); 

// 🔹 연결 테스트
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`✅ Connected to MongoDB!`);
  } catch (ex) {
    console.log(`❌ Unable to connect to database. ${ex.message}`);
    process.exit(1);
  }
})();

// 🔹 이메일로 사용자 찾기
function getUser(email) {
  return userCollection.findOne({ email: email });
}

// 🔹 사용자 추가
async function addUser(user) {
  await userCollection.insertOne(user);
}

// 🔹 사용자 업데이트 (닉네임, 점수 등)
async function updateUser(user) {
  await userCollection.updateOne(
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
  return userCollection.find(query, options).toArray();
}

// 🔹 Invites TOP 10 (friendInvites 기준)
async function getTopInvites() {
  const query = { friendInvites: { $gt: 0 } };
  const options = {
    sort: { friendInvites: -1 },
    limit: 10,
  };
  return userCollection.find(query, options).toArray();
}

module.exports = {
  getUser,
  addUser,
  updateUser,
  getTopDefeats,
  getTopInvites,
};
