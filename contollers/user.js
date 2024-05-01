const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function isStringInvalid(string) {
    if (string == undefined || string.length === 0) {
        return true
    } else {
        return false
    }
}

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        console.log(name, email, password)
        if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({ err: "Bad Parameter.. Something is missing" })
        }
        const existingUser = await User.findOne({ where: { email: email } })
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exist" })
        }
        const saltrounds = 10;
        const hash_password = await bcrypt.hash(password, saltrounds)
        const newUser = await User.create({ name, email, password: hash_password })
        res.status(201).json({ message: " Successfully create new user", user: newUser })


    } catch (err) {
        res.status(500).json(err)

    }
}
function generateAccessToken(id, name, ispremiumuser) {
    return jwt.sign({ userId: id, name: name, ispremiumuser }, 'secretkey')
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({ message: "Email ID or Password Is missing", success: false })
        }

        const user = await User.findOne({ where: { email: email } })
        if (user) {
            const password_campared = await bcrypt.compare(password, user.password)

            if (password_campared) {
                return res.status(200).json({ success: true, message: "Login Sucessful", token: generateAccessToken(user.id, user.name, user.ispremiumuser) })
            } else {
                return res.status(401).json({ message: "password Incorrect", success: false })
            }
        } else {
            return res.status(404).json({ message: "User Not Found", success: false })
        }

    } catch (err) {
        res.status(500).json({ message: err, success: false })

    }
}

module.exports = {
    signup: signup,
    login: login,
    generateAccessToken: generateAccessToken
}