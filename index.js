require('dotenv').config();
const express=require('express')
const app=express();
const PORT=process.env.PORT || 3000;
const cors=require('cors')
const routes=require('./routes/index')
const bodyParser=require('body-parser')
const {dbconnection} = require('./db')
const {Server}=require('socket.io')
const http=require('http')
const Board=require('./models/boards')
const server=http.createServer(app)
const clientUrl=process.env.CLIENT_URL || 'http://localhost:5173'
const handleSockets=require('./sockets')

const io=new Server(server,{
    cors:{
        origin:clientUrl,
        methods:["GET","POST","PATCH","DELETE"]
    }
})




io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  handleSockets(socket, io);
  
});

dbconnection();


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Middleware to parse JSON and URL-encoded data


app.use('/api',routes)



server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});