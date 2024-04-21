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

    // WEB SOCKET -------------------------------------------------------

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    function sendMessage() {
        if (input.trim() !== '') {
            socket.emit('chat message', input);
            setInput('');
        }
    };

    
    useEffect(() => {
        // Listen for incoming chat messages
        
        // socket.emit('chat message', 'ajay_sharma')

        socket.emit('connection')

        socket.emit('user auth', 'ajay_ji')
        
        socket.on('chat message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            console.log(message)
            console.log(socket.id)
        });

    }, []);

    // ------------------------------------------------------------------

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

        let sd = "ajay"
        let rc = "parth"
        fetch("http://localhost:8765/chats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                { sender: sd, reciever: rc }
            )
        }).then((r) => {
            r.json().then((r1) => {
                console.log(r1)
                setChatMessages(r1)
            })
        })
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
                    <div class="message-body">
                        <div class="sender-name">
                            ajay
                        </div>

                        <div class="message">
                            or bhai kya haal chall !!!
                        </div>

                        <div class="message-time">
                            time
                        </div>
                    </div>
                </div>

                <div id="writing-message-div">
                    <input id="message-bar" type="text" onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
                    <button id="send-btn" onClick={() => sendMessage()} >SEND</button>
                </div>
            </div>
        </main>
    )
}

export default Home