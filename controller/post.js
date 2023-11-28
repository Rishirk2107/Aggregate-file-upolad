const funs=require("../model/dbfuns");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const vari=require("./config");

dotenv.config();
let details;
let admin;
const JWT_SECRET_ADMIN=process.env.JWT_SECRET_ADMIN;
const JWT_SECRET_USER=process.env.JWT_SECRET_USER;

const adminlogin = async (req, res) => {
    var username = req.body.loginUsername;
    var password = req.body.loginPassword;
    var data = await funs.findAdmin(username, password);

    (data);

    if (data) {
        Token1 = data.adToken;
        await vari.handleToken1(Token1);
        admin=username
        // Simple redirect without any conditional logic
        res.redirect("/adminredirect");
        //res.s("Successfully logged in!"); // Replace with an appropriate message

    } else {
        res.json({ "message": "Unauthorized" });
    }
};

const userlogin=async(req,res)=>{
    var username=req.body.loginUsername;
    var password=req.body.loginPassword;
    let data=await funs.findUser(username,password);
    console.log(data);
    if (data){
        details=username
        Token2 = data.usToken;

        await vari.handleToken2(Token2);

        res.redirect("/products");
        //res.send("Successfully logged in!"); 
    }
    else{
        res.json({"message":"Unathorised"});
    }
}

const adminsignup = (req, res) => {
    var username = req.body.signupUsername;
    var password = req.body.signupPassword;

    const token = jwt.sign({ username: username }, JWT_SECRET_ADMIN);
    console.log(token);
    funs.insertAdmin(username, password, token);

    console.log(username, password, token);
    res.status(200).json({ message: 'Admin signed up successfully.' });
};


const usersignup=(req,res)=>{
    var username=req.body.signupUsername;
    var password=req.body.signupPassword;
    const token = jwt.sign({ username: username }, JWT_SECRET_USER);
    console.log(token);
    funs.insertUser(username, password, token);

    console.log(username, password, token);
    res.status(200).json({ message: 'User signed up successfully.' });
}


const adminupload=(req, res) => {
    console.log(req.body);
    const file = req.file;


  const name=file.filename;
  console.log(name);
  console.log(req.body.filename,req.body.productPrice)
  funs.insertProduct(admin,req.body.filename,name,req.body.productCount,req.body.productPrice);

  // Send a response
  res.json({ message: 'File uploaded successfully!' });

}
const ordersub=async(req, res) => {
    //const receivedData = req.body;
    console.log(details);
    //Received data: { productid: 'PO1', productcount: 'Available:0' }
    const result=await funs.decrement(req.body.productid)
    console.log(result);
    //console.log('Received data:', receivedData);
    if (result){
       await funs.increment(details,req.body.productid);
       await funs.addproducts(details,req.body.productid);
    res.json({ message: 'Product Purchased successfully!' });
        //res.json({message:"Product is Not Available"});
    }
    else{
       res.json({message:"Product is Not Available"});
    }
}

const userstatus=async(req,res)=>{
    console.log(req.body);
    if (req.body.message==1){
        const result1=await funs.numberofpurchase();
        console.log(result1);
        res.json(result1);
    }
    else if (req.body.message==2){
        const result2=await funs.numberofdiffproductspurchased();
        console.log(result2)
        res.json(result2);
    }
}

const adminstatus=async(req,res)=>{
    console.log(req.body)
    if(req.body.message==1){
        const result1=await funs.topsellercount();
        console.log(result1)
        res.json(result1); 
    }
    else if(req.body.message==2){
        const result2=await funs.topsellernoproduct();
        console.log(result2);
        res.json(result2);
    }
}

module.exports={
    userlogin,
    usersignup,
    adminlogin,
    adminsignup,
    adminupload,
    ordersub,
    userstatus,
    adminstatus
}