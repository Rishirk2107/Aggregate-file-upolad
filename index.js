const bodyParser =require("body-parser");
const express=require("express");
const dotenv = require('dotenv');
const ejs = require("ejs");
dotenv.config();
const mongoose = require('mongoose');
const gets=require("./model/views");
const posts=require("./controller/post")
const middleware=require("./controller/middleware");
const vari=require("./controller/config")

const MONGO_URI  = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


let Token1=null;
const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static("static"));
app.use('/uploads', express.static('uploads'));
app.use(express.static(__dirname+"/upload"))

//console.log(gets.adminupload)
app.get("/admin",gets.admin);
app.get("/",gets.user);
app.get("/adminredirect",gets.adminredirect)

app.get("/adminredirect", async (req, res) => {
try {
        
    const token1 = await vari.Token11();

    middleware.authenticateAdmin(token1)(req, res, () => {
        gets.adminredirect(req, res);
    });
} catch (error) {
    console.error('Error in /adminredirect route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

app.get("/adminupload", async (req, res) => {
    try {
        
        const token1 = await vari.Token11();

        middleware.authenticateAdmin(token1)(req, res, () => {
            gets.adminupload(req, res);
        });
    } catch (error) {
        console.error('Error in /adminupload route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/userstatus", async (req, res) => {
    try {
        
        const token1 = await vari.Token11();

        middleware.authenticateAdmin(token1)(req, res, () => {
            gets.userstatus(req, res);
        });
    } catch (error) {
        console.error('Error in /userstatus route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/products", async (req, res) => {
    try {
        const token = await vari.Token22();
        middleware.authenticateUser(token)(req, res, () => {
            gets.products(req,res);
        });
    } catch (error) {
        console.error('Error in /products route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/admin/signup",posts.adminsignup);
app.post("/admin/login",posts.adminlogin);
app.post("/user/signup",posts.usersignup);
app.post("/user/login",posts.userlogin);
app.post("/upload",middleware.upload.single("productImage"),posts.adminupload);
//app.post("/products",posts.products);
app.post('/order', posts.ordersub);
app.post("/userstatus",posts.userstatus);
app.post("/adminstatus",posts.adminstatus);


app.listen(3000,()=>{
    console.log("Server running at http://localhost:3000")
})