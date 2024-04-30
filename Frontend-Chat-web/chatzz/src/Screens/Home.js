import "../Styles/Home.css"
import logoImage from "../Images/cloverLogo.png"
import { useEffect, useState, useRef } from "react"
import loged_in_user from "./LogedInUser"
import { useNavigate } from "react-router-dom"

// WEB SOCKET --------------------------------------------
import io, { Socket } from 'socket.io-client';

const socket = io.connect('http://localhost:8765');
// ------------------------------------------------------------------

function Home() {

    const [current_person, setCurrentPerson] = useState()
    const [user, setUser] = useState([])
    const [chat_messages, setChatMessages] = useState([])

    const cp=useRef()
    const navigate = useNavigate()
    const screen_width_exceeds = window.matchMedia('(min-width:530px)').matches

    // WEB SOCKET -------------------------------------------------------

    const [input, setInput] = useState('');

    function sendMessage() {
        if (input !== '') {
            // socket.emit('chat message', JSON.stringify(tempObj));
            socket.emit('client to server', { sender: loged_in_user.username, reciever: current_person.username, content: input });
            document.getElementById("message-bar").value=''
        }
    };


    useEffect(() => { //USE EFFECT 1
        // Listen for incoming chat messages

        if(Object.keys(loged_in_user).length===0){
            navigate('/login')
        }

        socket.emit('connection')

        socket.emit('user auth', loged_in_user.username)

        // THE PROBLEM IS THAT THIS Socket.on IS RUNNING FROM THE TIME OF START AND THATS
        // WHY IT IS TAKING VALUES OF USESTATE WHEN THIS WEB APPLICATION WAS STARTED, SO IT
        // CAN BE SAID THAT THIS Socket.on IS CUTT OFF FROM THE REAL TIME MEMORY !!!
        // THE PROBLEM IS SOLVED BY USING 'useRef()' IN THE CODE !

        socket.on('server to client', (message) => {
            if (cp.current!=undefined && ((message.sender == cp.current.username && message.reciever == loged_in_user.username) || (message.sender == loged_in_user.username && message.reciever == cp.current.username))) {
                showChats()
            }
        });

    },[]);

    useEffect(()=>{
        let all_messages=document.getElementById("chat-messages")
        all_messages.scrollTop=all_messages.scrollHeight
    },[chat_messages])


    // ------------------------------------------------------------------

    useEffect(() => { // USE EFFECT 2

        cp.current=current_person

        // showChats() SHOULD BE BELOW THE cp.current=current_person LINE
        //  BECAUSE showChats() WORKS ACCORCING TO VALLUE OF cp.current,
        //  NOT ACCORDING TO current_person

        showChats()

    }, [current_person])

    function showChats() {
        // HERE SENDER AND RECIEVER ARE NOT OBJECTS, THEY ARE STRINGS ----------

        if (loged_in_user != undefined && cp.current != undefined) {

            fetch("http://localhost:8765/chats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    { sender: loged_in_user.username, reciever: cp.current.username }
                )
            }).then((r) => {
                r.json().then((r1) => {
                    setChatMessages(r1)
                })
            })
        }
    }


    function getUsers() {
        let searched_username = document.getElementById("search-bar").value
        fetch("http://localhost:8765/search-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                { searched_username:searched_username, searcher:loged_in_user.username }
            )
        }).then((r1) => {
            r1.json().then((r2) => {
                setUser(r2)
            })
        })
    }

    function friendSelected(naam) {

        setCurrentPerson(naam)
        
        //  CODE FOR RESPONSIVENESS----------------------------------------

        if(!screen_width_exceeds){
            document.getElementById("all-contacts").style.display="none"
            document.getElementById("chating-space").style.display="flex"
        }

        //----------------------------------------------------------------
    }

    function backToContacts(){
        document.getElementById("all-contacts").style.display="flex"
        document.getElementById("chating-space").style.display="none"
    }

    return (
        <main id="home-outer-div">
            <div id="all-contacts">
                <nav id="all-contacts-navbar" class="navbars">
                    <img id="logo-img" src={logoImage} />
                    <a>CLOVER</a>
                </nav>

                <nav id="user-bar" class="navbars">
                    <a>{loged_in_user===undefined?'':loged_in_user.name}</a>
                </nav>

                <div id="search-div">
                    <input type="search" id="search-bar" placeholder="Search" />
                    <button id="search-btn" onClick={() => getUsers()}>GO</button>
                </div>

                <div id="all-contacts-container">
                    {
                        user.map((naam) =>

                            <div className="contact-container" onClick={() => friendSelected(naam)} >
                                <div className="contact-dp" >

                                </div>

                                <div className="contact-body" >
                                    {naam.username}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

            <div id="chating-space">
                <nav id="chating-space-navbar" class="navbars">
                    <div id="back-btn-div">
                        <button id="back-btn" onClick={()=>backToContacts()}>&larr;</button>
                    </div>
                    <div id="chating-space-navbar-heading-div">
                        <h2 id="chating-space-navbar-heading">{current_person == undefined ? "" : current_person.name}</h2>
                    </div>
                </nav>

                <div id="chat-messages">
                    {
                        chat_messages.map((msg) =>
                            <div class="message-cell" style={msg.sender == loged_in_user.username ? { flexDirection: "row-reverse" } : { flexDirection: "row" }}>
                                <div class="message-body" >
                                    <div class="sender-name" style={msg.sender == loged_in_user.username ? { flexDirection: "row-reverse" } : { flexDirection: "row" }}>
                                        {msg.sender}
                                    </div>

                                    <div class="message" style={msg.sender == loged_in_user.username ? { flexDirection: "row-reverse" } : { flexDirection: "row" }}>
                                        {msg.content}
                                    </div>

                                    <div class="message-time" style={msg.sender == loged_in_user.username ? { flexDirection: "row-reverse" } : { flexDirection: "row" }}>
                                        {msg.time}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>

                <div id="writing-message-div">
                    <input id="message-bar" type="text" onChange={(e) => setInput(e.target.value.trim())} placeholder="Type a message..." />
                    {/* error ho to uper se .trim() hta dena */}
                    {/* uper se if input!='' hta dena */}
                    <button id="send-btn" onClick={() => sendMessage()} >&#10147;</button>
                </div>
            </div>
        </main>
    )
}

export default Home