const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors');
const multer = require('multer')
const path = require('path')
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const postRoute = require('./routes/posts')
const commentRoute = require('./routes/comments')


//database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("database is connected successfully!")
    }
    catch (err) {
        console.log(err)
    }
}

// middlewares
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );
    
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Private-Network", true);
    //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
    res.setHeader("Access-Control-Max-Age", 7200);
    
    // res.setHeader('Set-Cookie', cookie.serialize('token', 'yourCookieValue', {
    //     sameSite: 'None',
    //     secure: true, // Ensure the cookie is sent only over HTTPS
    //     httpOnly: true, // Recommended for security
    //     maxAge: 3600, // Adjust the max age as needed
    //     path: '/', // Adjust the path as needed
    //   }));
    

    next();
});
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: "https://dev-forum-d89af16a2-prit33.vercel.app", credentials: true }))
// app.use(cors());

// app.use(cors())

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/comments", commentRoute)
app.use("/images", express.static(path.join(__dirname, "/images")))


// //image upload
// const storage=multer.diskStorage({
//     destination:(req,file,fn)=>{
//         fn(null,'images')
//     },
//     filename:(req,file,fn)=>{
//         // fn(null,"image1.jpeg")
//         fn(null,req.body.img)
//     }
// })

// //image upload
// const upload=multer({storage:storage})

// app.post("/api/upload",upload.single("file"),(req,res)=>{
//     res.status(200).json("Image has been uploaded!")
// })
//image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    }, filename: (req, file, cb) => {
        // cb(null,"jeet123.jpg")
        cb(null, req.body.name)
    }
})
//image upload
const upload = multer({ storage: storage })
app.post("/api/upload", upload.single("file"), (req, res) => {
    console.log(req.body)
    res.status(200).json("Image has been uploaded!")
})



app.listen(process.env.PORT, () => {
    connectDB();
    console.log("app is running on port 5000")
})
