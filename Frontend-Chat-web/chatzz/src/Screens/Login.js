import "../Styles/Login.css"
import { useNavigate } from "react-router-dom"
import loged_in_user from "./LogedInUser"

function Login() {
    const navigate = useNavigate()

    function getNewUserDetails(){

        let name=document.getElementById("realName").value
        let username=document.getElementById("username-register").value
        let email=document.getElementById("email").value
        let password=document.getElementById("password-register").value
        // console.log(name)
        
        fetch("http://localhost:8765/create-indipendent-account", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                { name, username, email, password  }
            )
        })
    }

    function verification(){
        console.log("verificationn called")
        const username = document.getElementById("username-login").value
        const password = document.getElementById("password").value

        fetch("http://localhost:8765/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                { username, password }
            )
        }).then((r)=>{
            r.json().then((r1)=>{
                if(r1.status===200){

                    loged_in_user.name=r1.Object.name
                    loged_in_user.username=r1.Object.username
                    loged_in_user.email=r1.Object.email

                    console.log(loged_in_user)
                    navigate('/home')
                }
            })
        })     
    }

    function switchLoginRegister(current_state){
        if(current_state=="login"){
            document.getElementById("login-container").style.display="none"
            document.getElementById("register-container").style.display="flex"
        }
        else if(current_state=="register"){
            document.getElementById("login-container").style.display="flex"
            document.getElementById("register-container").style.display="none"
        }
    }

    return (
        <>
            <div class="form-container" id="login-container">
                <h2>Login</h2>
                <div id="login-form">
                    <input type="email" id="username-login" placeholder="Username" required />
                    <input type="password" id="password" placeholder="Password" required />
                    <button class="form-btn" onClick={()=>verification()}>LOGIN</button>
                </div>
                <div class="switch">
                    <span>Don't have an account?</span> <a onClick={()=>switchLoginRegister("login")}>Register</a>
                </div>
            </div>

            <div class="form-container" id="register-container" style={{display:"none"}}>
                <h2>Register</h2>
                <div action="http://localhost:8765/register" method="post" >
                    <input type="text" name="name" id="realName" placeholder="Name" required />
                    <input type="text" name="username" id="username-register" placeholder="Username" required />
                    <input type="email" name="email" id="email" placeholder="Email Address" required />
                    <input type="password" name="password" id="password-register" placeholder="Create Password" required />
                    <button class="form-btn" onClick={()=>getNewUserDetails()}>VERIFY OTP</button>
                    {/* <input type="text" name="otp" placeholder="Enter OTP" required />
                    <button class="form-btn">REGISTER</button> */}
                </div>
                <div class="switch">
                    <span>Already have an account?</span> <a onClick={()=>switchLoginRegister("register")}>Login</a>
                </div>
            </div>
        </>

        // <>
        // hello friends
        
        // </>
    )
}

export default Login