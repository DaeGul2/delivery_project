// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const menuRoutes = require('./routes/menuRoutes');

// .env 파일의 내용을 불러오기
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;
const CLIENT_URI = process.env.REACT_APP_API_URL;

// MongoDB와 연결하기
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB에 성공적으로 연결되었습니다.');
})
.catch((err) => {
  console.error('MongoDB 연결 에러:', err);
});

// CORS 설정 (모든 출처 허용)
app.use(cors());

// 미들웨어 설정
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    // 한글 파일 이름이 깨지지 않도록 파일 이름을 인코딩
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8').replace(/ /g, '_') + '-' + uniqueSuffix);
  },
});
const upload = multer({ storage });

// 라우트 설정 (multer 미들웨어 추가)
app.use('/api/menus', upload.single('menuPicture'), menuRoutes);

// 기본 라우트 설정
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
