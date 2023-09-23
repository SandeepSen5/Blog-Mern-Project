const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer');

const dotenv = require('dotenv').config()
const cors = require('cors')
const app = express()
const authController = require('./controllers/authControllers')
const blogController = require('./controllers/blogControllers')


// connect db

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Database Connected');
}).catch((error) => {
    console.log(error);
})

// routes
app.use('/images', express.static('public/images'))

//router
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/auth', authController)
app.use('/blog', blogController)

//multer

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/images')
    },
    filename: function(req, file, cb){
        cb(null, req.body.filename)
    }
})

const upload = multer({
    storage: storage
})


app.post('/upload', upload.single("image"), async(req, res) => {
    return res.status(200).json({msg: "Successfully uploaded"})
})


// connect server

app.listen(process.env.PORT, () => {
    console.log('Server has been Started');
})










