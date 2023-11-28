const path = require('path');
const funs=require("./dbfuns")
const admin=(req,res)=>{
    res.sendFile(path.join(__dirname,"../views/admin.html"));
}
const user=(req,res)=>{
    res.sendFile(path.join(__dirname,"../views/user.html"));
}
const adminupload=(req,res)=>{
    res.sendFile(path.join(__dirname, '../views/adminentry.html'));
}

const userstatus=(req,res)=>{
    res.sendFile(path.join(__dirname,"../views/userstatus.html"));
}

const products=async(req,res)=>{
    const products=await funs.findProduct();
    //console.log(products);
    res.render("products",{products})
    
}
const adminredirect=(req,res)=>{
    res.sendFile(path.join(__dirname,"../views/adminredirect.html"))
}

module.exports={
    admin,
    user,
    adminupload,
    products,
    userstatus,
    adminredirect
}