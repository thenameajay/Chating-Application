import "../Styles/Home.css"

function Home() {
    const names=["ajay", "amrudh", "parth", "ravi", "patrik", "abhishek", "nitin", "naveen"]
    const abc=names.map((naam)=>

    <div className="contact-container" >
        <div className="contact-dp" >

        </div>

        <div className="contact-body" >
            {naam}
        </div>
    </div>
)

//    function makeContacts(){
//         let result=[]
//         let elmnt=(
//             <div class="contact-container" >
//                 <div class="contact-dp" >
    
//                 </div>
    
//                 <div class="contact-body" >
//                     ajay sharma
//                 </div>
//             </div>
//         )
//         for (let index = 0; index < 5; index++) {
//             result+=elmnt
//         }
//         console.log(result)
//         return result
//    }

//    const rslt=makeContacts()

    return(
        <main id="home-outer-div">
            <div id="all-contacts">
                <nav id="all-contacts-navbar" class="navbars">
                    <a>CHATZ</a>
                </nav>

                <div id="search-div">
                    <input type="search" id="search-bar" placeholder="Search" />
                    <button id="search-btn">GO</button>
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
                    {abc}
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