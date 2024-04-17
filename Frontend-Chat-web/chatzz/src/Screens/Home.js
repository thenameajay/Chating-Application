import "../Styles/Home.css"
import { useEffect, useState } from "react"

function Home() {
    // const names = ["ajay", "amrudh", "parth", "ravi", "patrik", "abhishek", "nitin", "naveen"]
    let namesss = []
    let names2=[]

    // useEffect(()=>{
    //     setNames(namesss)
    // },[names2])

    const [names, setNames]=useState([])

    // const [abc, setabc]=useState([])

    // const abc = names.map((naam) =>

    //     <div className="contact-container" >
    //         <div className="contact-dp" >

    //         </div>

    //         <div className="contact-body" >
    //             {naam}
    //         </div>
    //     </div>
    // )


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

                console.log(r2)

                let temp = []
                r2.forEach(element => {
                    temp += element
                });
                setNames(temp)
                namesss=temp

            })
            // console.log(r)
            // console.log(r[0])
            // console.log(r[1])
        })
    }

    return (
        <main id="home-outer-div">
            <div id="all-contacts">
                <nav id="all-contacts-navbar" class="navbars">
                    <a>CHATZ</a>
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
                        namesss.map((naam) =>

                        <div className="contact-container" >
                            <div className="contact-dp" >
                
                            </div>
                
                            <div className="contact-body" >
                                {naam}
                            </div>
                        </div>
                    )
                    }
                </div>
            </div>

            <div id="chating-space">
                <nav id="chating-space-navbar" class="navbars">

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