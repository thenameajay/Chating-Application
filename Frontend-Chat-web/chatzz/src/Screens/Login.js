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
        
        fetch(`${process.env.REACT_APP_BACKEND_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                { name, username, email, password  }
            )
        })
    }

    function otpVerification(){
        const email = document.getElementById("email").value
        const userEnteredOtp = document.getElementById("otp").value

        fetch(`${process.env.REACT_APP_BACKEND_URL}/register/otp-verification`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                { email, userEnteredOtp }
            )
        }).then((r)=>{
            if(r.status===200){
                switchLoginRegister("register")
            }
            else{
                document.getElementById("otp-warning").style.display="flex"
            }
        })
    }

    function verification(){
        const username = document.getElementById("username-login").value
        const password = document.getElementById("password").value

        fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
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

                    navigate('/home')
                }
                else{
                    document.getElementById("credential-warning").style.display="flex"
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
                <label class="warnings" id="credential-warning" >Invalid USERNAME OR PASSWORD</label>
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
                    <button class="form-btn" onClick={()=>getNewUserDetails()}>GET OTP</button>
                    <label class="warnings" id="otp-warning">Invalid OTP</label>
                    <input type="text" id="otp" name="otp" placeholder="Enter OTP" required />
                    <button class="form-btn" onClick={()=>otpVerification()}>REGISTER</button>
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