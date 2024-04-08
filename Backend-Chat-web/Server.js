const express = require("express")
const app = express()
const myroutes=require('./Routes/UserRoutes')
const bodyParser=require('body-parser')
const db = require("./DB/Db")
const port = 8765

app.use(
    express.urlencoded({ extended: true })
);
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/',myroutes)

app.listen(port, ()=>{
    console.log(`Server is running on port number ${port}`)
})