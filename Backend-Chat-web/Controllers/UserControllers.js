const userSchema = require("../Schemas/user")
const otpSchema = require("../Schemas/otp")
const messageSchema = require("../Schemas/messages")
const newUserSchema = require("../Schemas/newUser")
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

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

// USER REGISTRATATION-------------------

exports.addUser = (req, res) => {

    const { name, username, email, password } = req.body;

    console.log(name)
    console.log(username)
    console.log(email)
    console.log(password)

    userSchema.find({ email: email }).then((rslt) => {
        if (rslt.length == 0) {

            const otp = Math.floor(Math.random() * 1000000).toString()

            transporter.sendMail({
                from: `"Weathering"<${process.env.MY_MAIL_ID}>`,
                to: email,
                subject: "OTP verification",
                text: "OTP mail",
                html: `
                <div style="background-color:white">
                    <h2 style="color:black">Hello ${name} </h2>
                    Your OTP for registering to Weathering is ${otp} .
                    <br/>
                    Please ignore if it not belongs to you and never share otp with anyone.
                    <br/>
                    Thank You for Registering.
                    <br/>
                    Team Weathering
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
            res.send("no such user exists")
            console.log("no such user exists")
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
        console.log(`${sender} to ${reciever} : messege sent`)
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
        r1.forEach(element => {
            console.log(`${element.sender} : ${element.content}`)
        });
        res.send(r1)
    })
}

exports.searchUser = (req, res) => {
    const { searched_username, searcher } = req.body

    if (searched_username == "all") {
        userSchema.find({username : {$ne : searcher}}).then((r1) => {
            console.log(r1)
            res.send(r1)
        })
    }
    else if(searched_username==searcher){
        console.log("its you, you searched yourself !")
        res.send("This account belongs to you !")
    }
    else {
        userSchema.find({ username: searched_username }).then((r1) => {
            if (r1.length != 0) {
                console.log("user found : " + r1)
                res.send(r1)
            }
            else {
                console.log("no such user found")
                res.send("no user found")
            }
        })
    }
}


// FOR DEBUGGING -----------------------------------------------------------------

exports.mailTest = (req, res) => {
    const { email } = req.body
    transporter.sendMail({
        from: `"Weathering"<${process.env.MY_MAIL_ID}>`,
        to: email,
        subject: "OTP verification",
        text: "OTP mail",
        html: `
        <div style="background-color:white">
            <br/>
            Please ignore if it not belongs to you and never share otp with anyone.
            <br/>
            Thank You for Registering.
            <br/>
            Team Weathering
        </div>
        `

    }).then((r) => {
        console.log("mail sended successfully")
        res.send("tested OK")
    }).catch((err) => {
        console.log("mail not sent")
        console.log(err)
        res.send("testing unsuccessfull")
    })
}

// ---------------------------------------------------------------------

exports.indipendentAccountCreation = (req, res) => {
    const { name, username, email, password } = req.body

    userSchema.find({ username: username }).then((r) => {
        if (r.length != 0) {
            console.log("user already existed")
            res.send("this username is already taken")
        }
        else {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    console.log("Error in Encryption salt generation !")
                    res.send("Error in Encryption salt generation !")
                }
                else {
                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) {
                            console.log("Error in Encryption hash Generation ! (indipendent account)")
                        }
                        else {
                            encrptPassword = hash
                            userSchema.insertMany({ name: name, username: username, email: email, password: encrptPassword }).then((r1) => {
                                console.log("data storation : SUCCESSFULL ")
                                res.send("data stored successfully")
                            }).catch((err) => {
                                console.log("error in storing data (indipendent account)")
                                console.log(err)
                            })
                        }
                    })
                }
            })
        }
    }).catch((err) => {
        console.log("error in indipendent account creation !")
        res.send("error in indipendent account creation !")
        console.log(err)
    })
}