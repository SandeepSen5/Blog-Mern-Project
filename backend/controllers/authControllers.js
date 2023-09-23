const authController = require('express').Router();
const User = require('../models/User')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

authController.post('/register', async (req, res) => {
    try {
        console.log("hai1");
        console.log(req.body.email);
        const isExisting = await User.findOne({ email: req.body.email })
        if (isExisting) {
            return res.status(401).json({ message: " User Registered Already" });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = await User.create({ ...req.body, password: hashedPassword })
        const { password, ...others } = newUser._doc
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '5h' })

        return res.status(201).json({ user: others, token })

    } catch (error) {
        return res.status(500).json(error)
    }
})

authController.post('/login', async (req, res) => {
    console.log('1');
    try {
        const user = await User.findOne({ email: req.body.email });
        console.log('11');
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials: User not found" });
        }
        console.log('2');
        const comparePass = await bcrypt.compare(req.body.password, user.password);
        if (!comparePass) {
            return res.status(401).json({ message: "Invalid credentials: Incorrect password" });
        }
        console.log('3');
        const { password, ...others } = user._doc;
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
        console.log('4');
        return res.status(200).json({ user: others, token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = authController