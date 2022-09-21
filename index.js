const express = require('express');
const registerValidation = require('./register_validator');
const jwt = require('jsonwebtoken')
const isAuthenticated = require('./is_authenticated')
const app = express();
const port = 3000;

app.use(express.json())


// const logger = async (req, res, next)=>{
//     res.on('finish',()=>{
//         console.log(req.method, req.url)
//     })

//     next();

// }

// const timestamp = async(req, res, next)=>{
//     console.log(new Date().toISOString())
//     next();
// }

// app.use(logger,timestamp);

// app.use(UserRouter)

// app.use((err,req,res,next)=>{
//     if(err.status == undefined){
//         return res.status(500).send(err.message)
//     }
//     res.status(err.status).send(err.message)
// })


const users = []
    // {
    //     id: 1,
    //     username: "maria",
    //     password: "mariaa",
    //     fullName: "maria a"
    // }
// ]

const blogposts = []

app.get("/my-profile", isAuthenticated, (req, res) => {
    return res.json({
        user: req.userData.name
    })
})

//API REGISTER
app.post("/user/register", registerValidation, (req, res) => {
    const currentUserId = 
        (users.length && users[users.length-1].id) || 0;
    let userId =  currentUserId + 1

    const {username, email, password} = req.body;

    const user = {
        id: userId,
        username,
        email,
        password
    };

    users.push(user)
    
    return res.send({
        id: userId,
        message: "User berhasil ditambahkan",
        data: users,
    })
})

// app.get('/user/register', (req, res) => {
//     return res.send(users)
// })


//API LOGIN
app.post("/user/login", (req, res) => {

    const {email, password} = req.body;

    const isFoundUser = users.find((user) => user.email == email)
    console.log(isFoundUser)

    if(isFoundUser) {
        const isValidPassword = isFoundUser.password == password

        if(isValidPassword) {
            const jwtPayload = jwt.sign({username: isFoundUser.username, id: isFoundUser.id}, 'SomeSecret')
            return res.json({token: jwtPayload, message: "Login Berhasil"})
        }
    }

    return res.status(400).json({error: true, message: "Login gagal, sepertinya user tidak terdaftar atau password anda salah"})

})

//API BLOGPOST 
app.post("/blogpost", isAuthenticated, (req, res) => {

    const currentBlogpostId = 
        (blogposts.length && blogposts[blogposts.length-1].id) || 0;
    let blogpostId =  currentBlogpostId + 1

    const {title,content,likes} =req.body;

    const blogpost = {
        id:blogpostId,
        name: req.userData.name,
        userId,
        title,
        content,
        likes,
    };

    blogposts.push(blogpost)

    return res.send({
        id: blogpostId,
        message: "blogpost berhasil ditambahkan",
        data: blogposts,
    })
})

app.get('/blogpost', (req, res) => {
    return res.send(blogposts)
})

app.listen(port, () => console.log("Server run on port: "+port))