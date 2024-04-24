import "../Styles/Home.css"
import { useEffect, useState } from "react"
import loged_in_user from "./LogedInUser"

// WEB SOCKET --------------------------------------------
import io from 'socket.io-client';

const socket = io.connect('http://localhost:8765');
// ------------------------------------------------------------------

function Home() {
    // const names = ["ajay", "amrudh", "parth", "ravi", "patrik", "abhishek", "nitin", "naveen"]

    // useEffect(()=>{
    //     setNames(namesss)
    // },[names2])

    const [user, setUser] = useState([])
    const [current_person, setCurrentPerson] = useState()
    const [chat_messages, setChatMessages] = useState([])
    const [last_message, setLastMessage] = useState()

    // WEB SOCKET -------------------------------------------------------

    const [input, setInput] = useState('');

    const tempObj = {
        naam: "plyr",
        kaam: "hacker"
    }

    function sendMessage() {
        if (input !== '') {
            // socket.emit('chat message', input);
            // socket.emit('chat message', JSON.stringify(tempObj));
            socket.emit('chat message', { sender: loged_in_user.username, reciever: current_person.username, content: input });



            // fetch("http://localhost:8765/send-message", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(
            //         { sender: loged_in_user.username, reciever: current_person.username, content: input }
            //     )
            // }).then((r)=>{
            //     setInput('');
            // })


        }
    };


    useEffect(() => {
        // showChats()
        // Listen for incoming chat messages

        // socket.emit('chat message', 'ajay_sharma')

        socket.emit('connection')

        socket.emit('user auth', loged_in_user.username)

        socket.on('chat message', (message) => {
            setChatMessages((prevMessages) => [...prevMessages, message]);
            console.log(message)
            console.log(socket.id)
        });

    }, []);

    // ------------------------------------------------------------------

    useEffect(() => {
        showChats()
        console.log("second useeffect called !")
    }, [current_person])

    // function testing(){
    //     let obj1={
    //         naam:"ajay",
    //         kaam:"developer"
    //     }

    //     let obj2={
    //         naam:"ajay",
    //         kaam:"developer"
    //     }

    //     if(obj1.naam===obj2.naam){
    //         console.log("yes, they are equal ")
    //         console.log(obj1)
    //         console.log(obj2)
    //     }
    //     else{
    //         console.log("not equal")
    //         console.log(obj1)
    //         console.log(obj2)
    //     }
    // }

    function showChats() {
        // HERE SENDER AND RECIEVER ARE NOT OBJECTS, THEY ARE STRINGS ----------

        console.log("loged in user---")
        console.log(loged_in_user)

        console.log("current user---")
        console.log(current_person)


        if (loged_in_user != undefined && current_person != undefined) {

            fetch("http://localhost:8765/chats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    { sender: loged_in_user.username, reciever: current_person.username }
                )
            }).then((r) => {
                r.json().then((r1) => {
                    console.log("messages are ---")
                    console.log(r1)
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
                { searched_username }
            )
        }).then((r1) => {
            r1.json().then((r2) => {
                setUser(r2)
            })
        })
    }

    function friendSelected(naam) {
        console.log(chat_messages) //DEBUGGING
        setCurrentPerson(naam)
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