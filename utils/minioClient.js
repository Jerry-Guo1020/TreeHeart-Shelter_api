const Minio = require('minio')
const minioClient = new Minio.Client({
  endPoint: '43.142.21.211',  // 确保这是你的 Minio 服务器的正确 IP 地址
  port: 59000, // 这是 Minio API 的端口，用于后端操作 Minio
  useSSL: false,
  accessKey: 'jerry',
  secretKey: 'gjr@2025YYDS'
})
const BUCKET = 'community'
module.exports = { minioClient, BUCKET }
