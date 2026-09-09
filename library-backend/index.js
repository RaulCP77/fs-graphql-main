require('dotenv').config()

const startServer = require('./server')
const connectDB = require('./db')
const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI;


const main = async () => {
  await connectDB(MONGODB_URI)
  startServer(PORT)
}
main()