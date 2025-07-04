const Minio = require('minio')
const minioClient = new Minio.Client({
  endPoint: '43.142.21.211',  
  port: 59000,
  useSSL: false,
  accessKey: 'jerry',
  secretKey: 'gjr@2025YYDS'
})
const BUCKET = 'community'
module.exports = { minioClient, BUCKET }
