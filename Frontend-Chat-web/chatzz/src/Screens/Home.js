import "../Styles/Home.css"
import { useEffect, useState } from "react"
import loged_in_user from "./LogedInUser"

function Home() {
    // const names = ["ajay", "amrudh", "parth", "ravi", "patrik", "abhishek", "nitin", "naveen"]

    // useEffect(()=>{
    //     setNames(namesss)
    // },[names2])

    const [user, setUser]=useState([])
    const [current_person, setCurrentPerson]=useState()


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

    function friendSelected(naam){
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
                    {/* <div class="contact-container">
                        <div class="contact-dp">

                        </div>

                        <div class="contact-body">
                            ajay sharma
                        </div>
                    </div> */}
                    {/* <elmnt style={{display : "flex" , height: "100%", width: "95%", border:"1px solid red"}}/> */}
                    {
                        user.map((naam) =>

                        <div className="contact-container" onClick={()=>friendSelected(naam)} >
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
                    <h2 id="chating-space-navbar-heading">{current_person==undefined?"":current_person.name}</h2>
                </nav>

                <div id="chat-messages">

                </div>

                <div id="message-div">
                    <input id="message-bar" type="text" placeholder="Type a message..." />
                    <button id="send-btn">SEND</button>
                </div>
            </div>
        </main>
    )
}

export default Home