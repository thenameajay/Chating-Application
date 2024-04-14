import "../Styles/Home.css"

function Home() {

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
                    <div class="contact-container">
                        <div class="contact-dp">

                        </div>

                        <div class="contact-body">

                        </div>
                    </div>

                    <div class="contact-container">
                        <div class="contact-dp">

                        </div>

                        <div class="contact-body">

                        </div>
                    </div>
                    
                    <div class="contact-container">
                        <div class="contact-dp">

                        </div>

                        <div class="contact-body">

                        </div>
                    </div>

                    <div class="contact-container">
                        <div class="contact-dp">

                        </div>

                        <div class="contact-body">

                        </div>
                    </div>
                    
                    <div class="contact-container">
                        <div class="contact-dp">

                        </div>

                        <div class="contact-body">

                        </div>
                    </div>
                    <div class="contact-container">
                        <div class="contact-dp">

                        </div>

                        <div class="contact-body">

                        </div>
                    </div>
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