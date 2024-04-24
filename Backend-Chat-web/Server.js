const express = require("express")
const app = express()
const messageSchema = require("./Schemas/messages")
const myroutes = require('./Routes/UserRoutes')
const bodyParser = require('body-parser')
const db = require("./DB/Db")
const port = 8765
const cors = require("cors")

const http = require('http');
const socketIo = require('socket.io');
const SendmailTransport = require("nodemailer/lib/sendmail-transport")

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
    // let client_already_present = false

    if(active_clients.find(user=>user.username===username)){
      console.log("client already present !")
    }
    else{
      console.log("username is : " + username)
      clientDetails.username = username
      clientDetails.socketID = socket.id
      active_clients.push(clientDetails)
    }

    // active_clients.forEach(element => {
    //   if (element.username == username) {
    //     client_already_present = true
    //   }
    // });

    // if (!client_already_present) {
    //   console.log("username is : " + username)
    //   clientDetails.username = username
    //   clientDetails.socketID = socket.id
    //   active_clients.push(clientDetails)
    // }

    // console.log(active_clients)
  })


  // console.log(socket.id)
  // console.log(clientId[0])
  // console.log(typeof(clientId[0]))

  // Handle a chat message event
  socket.on('chat message', (message) => {
    console.log('Message:', message);  // DEBUGGING

    message.time=Number(new Date()).toString()

    // SENDING MESSAGE TO RECIEVER ----------------
    if(active_clients.find(user=>user.username===message.reciever)){
      sendMessageToClient(user.socketID, message)
    }

    // REPLICATING MESSAGE TO SENDER ---------------------
    sendMessageToClient(socket.id, message)

    console.log(active_clients)

    // INSERTING MESSAGE IN THE DATABASE ------------------------
    messageSchema.insertMany({ sender: message.sender, reciever: message.reciever, time: message.time, content: message.content }).then((r1) => {
      console.log(`${message.sender} to ${message.reciever} : messege sent`)
    }).catch((err) => {
      console.log(`${message.sender} to ${message.reciever} : messege not sent`)
      console.log(err)
    })



    // Broadcast the message to all connected clients
    // io.emit('chat message', message);
  });

  // sendMessageToClient(socket.id, 'Hello, client!, aa gya mu uthakr');
  // sendMessageToClient(clientId[1], 'kya be client!, kya chahiye re tereko ');


  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A client disconnected');
    let index = active_clients.findIndex(obj => obj.username === clientDetails.username)

    if (index != -1) {
      active_clients.splice(index, 1)
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
  }
  else if(socketId==""){
    console.log("user is offline")
  }
  else {
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