const express = require("express")
const app = express()
const myroutes=require('./Routes/UserRoutes')
const bodyParser=require('body-parser')
const db = require("./DB/Db")
const port = 8765
const cors=require("cors")

const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server,{cors:{
    origin:'http://localhost:3000',
    methods:['GET', 'POST'],
    credentials:true
}});

app.use(cors({origin:'http://localhost:3000'}))

app.use(
    express.urlencoded({ extended: true })
);
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/',myroutes)

// WEB SOCKET ---------------------------------------

io.on('connection', (socket) => {
  console.log('A client connected');

  // Handle a chat message event
  socket.on('chat message', (message) => {
    console.log('Message:', message);
    // Broadcast the message to all connected clients
    io.emit('chat message', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// --------------------------------------------------

// app.listen(port, ()=>{
//     console.log(`Server is running on port number ${port}`)
// })

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});