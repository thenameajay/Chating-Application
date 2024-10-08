const userSchema = require("../Schemas/user")
const otpSchema = require("../Schemas/otp")
const messageSchema = require("../Schemas/messages")
const newUserSchema = require("../Schemas/newUser")
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const { json } = require("body-parser")
require("dotenv").config()

// for email-------------------------------------------

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MY_MAIL_ID,
        pass: process.env.APP_PASSWORD,
    },
})

// --------------------------------------------------------


// FOR AI USE----------------------------------------------------------------------

// THIS CODE IS USED TO GET TEXT OUTPUT FROM PROMPT TEXT
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_ID);

async function run(prompt) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  // const prompt = "give me name of any five fruits"

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return text
}

// --------------------------------------------------------------------------------

// USER REGISTRATATION-------------------

exports.addUser = (req, res) => {

    const { name, username, email, password } = req.body;

    userSchema.find({ email: email }).then((rslt) => {
        if (rslt.length == 0) {

            const otp = Math.floor(Math.random() * 1000000).toString()

            transporter.sendMail({
                from: `"CLOVER"<${process.env.MY_MAIL_ID}>`,
                to: email,
                subject: "OTP verification",
                text: "OTP mail",
                html: `
                <div style="background-color:white">
                    <h2 style="color:black">Hello ${name} </h2>
                    Your OTP for registering to CLOVER is ${otp} .
                    <br/>
                    Please ignore if it not belongs to you and never share otp with anyone.
                    <br/>
                    Thank You for Registering.
                    <br/>
                    Team CLOVER
                </div>
                `

            }).then((r) => {
                console.log("otp sent")
                res.send("otp sent successfully, please check your mail")

                otpSchema.find({ email: email }).then((r1) => {
                    if (r1[0] != 0 && Number(new Date) - r1[0].otp.time > 60000) {
                        console.log("multiple requests existed")
                        otpSchema.deleteOne({ email: email }).then((r3) => {
                            console.log("opt data deleted")
                        }).catch((err) => {
                            console.log("error in otp data deletion")
                        })

                        newUserSchema.deleteOne({ email: email }).then((r4) => {
                            console.log("newUserSchema data deleted")
                        }).catch((err) => {
                            console.log("error in newUserSchema data deletion")
                        })
                    }
                })
            }).catch((err) => {
                console.log("error in sending otp")
                // otpSchema.deleteOne({ email: email }).then((r3) => {
                //     console.log("opt data deleted")
                // }).catch((err) => {
                //     console.log("error in otp data deletion")
                // })

                // newUserSchema.deleteOne({ email: email }).then((r4) => {
                //     console.log("newUserSchema data deleted")
                // }).catch((err) => {
                //     console.log("error in newUserSchema data deletion")
                // })
                console.log(err)

                res.send("error in sending otp")

            })

            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    console.log("Error in Encryption salt generation !")
                }
                else {
                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) {
                            console.log("Error in Encryption hash Generation !")
                        }
                        else {
                            encrptPassword = hash
                            newUserSchema.insertMany({ name: name, username: username, email: email, password: encrptPassword }).then((r11) => {
                                console.log("data stored successfully")
                            }).catch((err) => {
                                console.log("error in storing data")
                                console.log(err)
                            })
                        }
                    })
                }
            })

            otpSchema.insertMany({ otp: otp, time: Number(new Date()), email: email }).then((r) => {
                console.log("instertion in otp schema : sucessful")
            }).catch((err) => {
                console.log("error in inserting data in otpschema")

                newUserSchema.deleteOne({ email: email }).then((r1) => {
                    console.log("new user temp data deletion successful")
                }).catch((err) => {
                    console.log("error in newuser temp data deletion")
                })
            })
        }
        else {
            console.log("User already exixted with this email address !!!")
            res.status(403).send({ status: 403, message: "User already exists with this email address !" })
        }
    }).catch((errr) => {
        console.log("error occured while searching user in database !!!")
        console.log(errr)
    })
}

// OTP VERIFICATION---------

exports.verifyOtp = (req, res) => {
    const { email, userEnteredOtp } = req.body
    newUserSchema.find({ email: email }).then((r1) => {
        if (r1.length == 0) {
            res.send("no such email address found")
        }
        else {
            otpSchema.find({ email: email }).then((r2) => {
                if (r2.length == 0) {
                    res.send("We think your otp may probabily not stored in our database, sorry!")
                }
                else {
                    if (userEnteredOtp == r2[0].otp) {

                        if (Number(new Date) - Number(r2[0].time) < 300000) {
                            userSchema.insertMany({ name: r1[0].name, username: r1[0].username, email: r1[0].email, password: r1[0].password })
                            res.status(200).send({ status: 200, message: "Registration Successfull !" })
                            console.log("registration successfull")
                        }
                        else {
                            res.status(403).send({ status: 403, message: "Time Limit Exceeded !" })
                            console.log("time limit exceed !!!")
                        }

                        newUserSchema.deleteOne({ email: email }).then((r1) => {
                            console.log("new user temp data deletion successful")
                        }).catch((err) => {
                            console.log("error in newuser temp data deletion")
                        })

                        otpSchema.deleteOne({ email: email }).then((r3) => {
                            console.log("opt data deleted")
                        }).catch((err) => {
                            console.log("error in otp data deletion")
                        })
                    }
                    else {
                        console.log("invalid otp")
                        res.status(401).send({ status: 401, message: "Invalid OTP !" })
                    }
                }
            })
        }
    })

}

// USER LOGIN-------------

exports.login = (req, res) => {
    const { username, password } = req.body

    userSchema.find({ username: username }).then((r1) => {
        if (r1.length == 0) {
            console.log("no such user exists")
            res.status(404).send({ status: 404, message: "No such user Exists" })
        }
        else {
            bcrypt.compare(password, r1[0].password, function (err, status) {
                if (err) {
                    console.log("Error in password matching")
                }
                else {
                    if (status) {
                        console.log("Login Successful, Welcome " + r1[0].name)
                        res.status(200).send({ status: 200, message: "login successfull", Object:r1[0] })
                    }
                    else {
                        console.log("invalid password")
                        res.status(312).send({ status: 312, message: "invalid password" })
                    }
                }
            })
        }
    })
}


// SENDING MESSAGE ------------------------------------------

exports.sendMessage = (req, res) => {
    const { sender, reciever, content } = req.body;

    messageSchema.insertMany({ sender: sender, reciever: reciever, time: Number(new Date()), content: content }).then((r1) => {
        // console.log(`${sender} to ${reciever} : messege sent`)
        res.send("message sent")
    }).catch((err) => {
        console.log(`${sender} to ${reciever} : messege not sent`)
        console.log(err)
    })
}


// SHOWING MESSAGE FOR A PARTICULAR CHAT ----------------------------------

exports.showMessages = (req, res) => {
    const { sender, reciever } = req.body;
    
    messageSchema.find({ $or: [{ sender: sender, reciever: reciever }, { sender: reciever, reciever: sender }] }).then((r1) => {
        // r1.forEach(element => {
        //     console.log(`${element.sender} : ${element.content}`)
        // });
        res.send(r1)
    }).catch((err)=>{
        console.log("Error in showing messages !")
        console.log(err)
        res.status(406).send({ status: 406, message: "Inappropriate Request !" })
    })
}

exports.searchUser = (req, res) => {
    const { searched_username, searcher } = req.body

    if (searched_username.toString().toLowerCase() == "all") {
        userSchema.find({username : {$ne : searcher}}).then((r1) => {
            // console.log(r1)
            res.send(r1)
        }).catch((err)=>{
            console.log("Error in searching user !")
            console.log(err)
            res.status(406).send({ status: 406, message: "Something went wrong" })
        })
    }
    else if(searched_username==searcher){
        console.log("its you, you searched yourself !")
        res.status(400).send({ status: 400, message: "This account belongs to you !" })
    }
    else {
        userSchema.find({ username: searched_username }).then((r1) => {
            if (r1.length != 0) {
                // console.log("user found : " + r1)
                res.send(r1)
            }
            else {
                console.log("no such user found")
                res.status(404).send({ status: 404, message: "no user found" })
            }
        }).catch((err)=>{
            console.log("Error in searching user !")
            console.log(err)
            res.status(406).send({ status: 406, message: "Something went wrong" })
        })
    }
}

exports.wakeupserver = (req, res)=>{
    res.send({message: "wake up to reality"})
    // res.send("wake up to reality")
    console.log("Waking server")
}

exports.geminiAI = async (req, res)=>{
    const prmpt=req.body.prmpt
    console.log(prmpt)
    const ansr =await run(prmpt)
    // console.log(ansr)
    // console.log(typeof ansr)

    res.send(ansr)
}