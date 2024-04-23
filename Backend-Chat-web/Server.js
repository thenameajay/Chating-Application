const express = require("express")
const app = express()
const myroutes = require('./Routes/UserRoutes')
const bodyParser = require('body-parser')
const db = require("./DB/Db")
const port = 8765
const cors = require("cors")

const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({ origin: 'http://localhost:3000' }))

app.use(
  express.urlencoded({ extended: true })
);
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', myroutes)

// WEB SOCKET ---------------------------------------

const connectedClients = {};
let active_clients = []

io.on('connection', (socket) => {
  console.log('A client connected');

  const clientDetails = {}

  connectedClients[socket.id] = socket;
  // clientId.push(socket.id)
  // console.log(connectedClients)

  socket.on('user auth', (username) => {
    let client_already_present = false
    active_clients.forEach(element => {
      if (element.username == username) {
        client_already_present = true
      }
    });

    if (!client_already_present) {
      console.log("username is : " + username)
      clientDetails.username = username
      clientDetails.socketID = socket.id
      active_clients.push(clientDetails)
    }

    // console.log(active_clients)
  })


  // console.log(socket.id)
  // console.log(clientId[0])
  // console.log(typeof(clientId[0]))

  // Handle a chat message event
  socket.on('chat message', (message) => {
    console.log('Message:', message);
    // Broadcast the message to all connected clients
    io.emit('chat message', message);
  });

  sendMessageToClient(socket.id, 'Hello, client!, aa gya mu uthakr');
  // sendMessageToClient(clientId[1], 'kya be client!, kya chahiye re tereko ');
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A client disconnected');
    let index=active_clients.findIndex(obj => obj.username === clientDetails.username)

    if(index!=-1){
      active_clients.splice(index,1)
    }

    console.log(active_clients)

    delete connectedClients[socket.id];
  });
});

function sendMessageToClient(socketId, message) {
  console.log("sending message to client |/__")
  const socket = connectedClients[socketId];
  if (socket) {
    socket.emit('chat message', message);
  } else {
    console.log('Socket ID not found:', socketId);
  }
}



// --------------------------------------------------

// app.listen(port, ()=>{
//     console.log(`Server is running on port number ${port}`)
// })

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});