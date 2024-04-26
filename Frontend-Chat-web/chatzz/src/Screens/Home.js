import "../Styles/Home.css"
import { useEffect, useState, useRef } from "react"
import loged_in_user from "./LogedInUser"

// WEB SOCKET --------------------------------------------
import io, { Socket } from 'socket.io-client';

const socket = io.connect('http://localhost:8765');
// ------------------------------------------------------------------

function Home() {

    const [current_person, setCurrentPerson] = useState()
    const [user, setUser] = useState([])
    const [chat_messages, setChatMessages] = useState([])

    const cp=useRef()

    // WEB SOCKET -------------------------------------------------------

    const [input, setInput] = useState('');

    function sendMessage() {
        if (input !== '') {
            console.log("all previous chat_messages ---")
            console.log(chat_messages)
            console.log("send button clicked")
            // socket.emit('chat message', JSON.stringify(tempObj));
            socket.emit('client to server', { sender: loged_in_user.username, reciever: current_person.username, content: input });
            // document.getElementById("message-bar").value=''
            console.log("current person in (sendMessage)")
            console.log(current_person)
        }
        else{
            console.log("no message to send !")
        }
    };


    useEffect(() => { //USE EFFECT 1
        // Listen for incoming chat messages

        socket.emit('connection')

        socket.emit('user auth', loged_in_user.username)

        console.log("use effect 1 called") // for debugging

        // THE PROBLEM IS THAT THIS Socket.on IS RUNNING FROM THE TIME OF START AND THATS
        // WHY IT IS TAKING VALUES OF USESTATE WHEN THIS WEB APPLICATION WAS STARTED, SO IT
        // CAN BE SAID THAT THIS Socket.on IS CUTT OFF FROM THE REAL TIME MEMORY !!!

        socket.on('server to client', (message) => {
            console.log("use effect 1 --> socket.on") // debugging
            console.log(message)
            console.log("loged in user --- ")
            console.log(loged_in_user)
            console.log("cp :--- ")
            console.log(cp.current)
            if (cp.current!=undefined && ((message.sender == cp.current.username && message.reciever == loged_in_user.username) || (message.sender == loged_in_user.username && message.reciever == cp.current.username))) {
                // setChatMessages((prevMessages) => [...prevMessages, message]);
                console.log("if in socket.io --sss-")
                showChats()
            }
            // console.log("current_person after if ---")
            // console.log(current_person)
        });

    },[]);


    // ------------------------------------------------------------------

    useEffect(() => { // USE EFFECT 2
        console.log("useeffect 2 called ! ( current person changed )")
        console.log("current person is ------")
        console.log(current_person)
        cp.current=current_person

        // showChats() SHOULD BE BELOW THE cp.current=current_person LINE
        //  BECAUSE showChats() WORKS ACCORCING TO VALLUE OF cp.current,
        //  NOT ACCORDING TO current_person
        showChats()

    }, [current_person])

    function showChats() {
        // HERE SENDER AND RECIEVER ARE NOT OBJECTS, THEY ARE STRINGS ----------

        console.log("(showChats) loged in user---")
        console.log(loged_in_user)

        console.log("(showChats) current user---")
        console.log(cp.current)

        if (loged_in_user != undefined && cp.current != undefined) {

            fetch("http://localhost:8765/chats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    { sender: loged_in_user.username, reciever: cp.current.username }
                )
            }).then((r) => {
                r.json().then((r1) => {
                    console.log("(showChats) messages are ---")
                    console.log(r1)
                    setChatMessages(r1)
                })
            })
        }
        else{ //  DEGBUGGING
            console.log("loged in user / current person is undefined")
        }
    }


    function getUsers() {
        let searched_username = document.getElementById("search-bar").value
        fetch("http://localhost:8765/search-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                { searched_username }
            )
        }).then((r1) => {
            r1.json().then((r2) => {
                setUser(r2)
            })
        })
    }

    function friendSelected(naam) {
        console.log("(friendSelected) chat messages---") //DEBUGGING
        console.log(chat_messages) //DEBUGGING
        setCurrentPerson(naam)
        console.log("naaam ---") //DEBUGGING
        console.log(naam) //DEBUGGING
    }

    return (
        <main id="home-outer-div">
            <div id="all-contacts">
                <nav id="all-contacts-navbar" class="navbars">
                    <a>CHATZ</a>
                </nav>

                <nav id="user-bar" class="navbars">
                    <a>{loged_in_user.username}</a>
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
                                    {naam.name}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

            <div id="chating-space">
                <nav id="chating-space-navbar" class="navbars">
                    <h2 id="chating-space-navbar-heading">{current_person == undefined ? "" : current_person.name}</h2>
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
                    <button id="send-btn" onClick={() => sendMessage()} >SEND</button>
                </div>
            </div>
        </main>
    )
}

export default Home