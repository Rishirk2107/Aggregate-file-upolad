const db=require("./dbschema");
//const mongoose=require("mongoose");
async function insertUser(username, password,token) {
    try {
      const newUser = new db.user({
        username: username,
        password: password,
        usToken:token,
        //number:0
        // other fields as needed
      });
  
      await newUser.save();
      console.log('User inserted successfully');
    } catch (error) {
      console.error('Error inserting user:', error);
    }
  }
  async function insertAdmin(username, password,token) {
    try {
      const newUser = new db.admin({
        username: username,
        password: password,
        adToken: token
        // other fields as needed
      });
  
      await newUser.save();
      console.log('User inserted successfully');
    } catch (error) {
      console.error('Error inserting user:', error);
    }
  }
  


  async function findUser(username,password) {
    try {
      // Find a user with the specified username
      const user = await db.user.findOne({ username,password });
  
      if (user) {
        const foundUsername = user.username;
        const foundPassword = user.password;
        const token=user.usToken;
  
        console.log('Username found:', foundUsername);
        console.log('Password found:', foundPassword);

        return ({"username":username,"password":password,"usToken":token})
        // You can now use foundUsername and foundPassword as needed
      } else {
        console.log('User not found');
        return(null)
      }
    } catch (error) {
      console.error('Error finding user:', error);
    }
  }
  async function findProduct(){
    try{
      const products=await db.product.find({})
      return products;
    }
    catch(error){
      console.error("Error Finding details",error)
    }
  }
  async function findAdmin(username,password) {
    try {
      // Find a user with the specified username
      const user = await db.admin.findOne({ username,password });
      console.log(user);
      if (user) {
     const foundUsername = user.username;
     const foundPassword = user.password;
     const token=user.adToken;
  
        console.log('Username found:', foundUsername);
        console.log('Password found:', foundPassword);
        return ({"username":username,"password":password,"adToken":token})
        // You can now use foundUsername and foundPassword as needed
      } else {
        console.log('User not found');
        return null;
      }
    } catch (error) {
      console.error('Error finding user:', error);
    }
  }
  async function insertProduct(admin,username,filename,count,price) {
    try {
      console.log(admin);
      const productId = await getNextSequenceValue('products');
      const id="PO"+productId.toString();
      const newUser = new db.product({
        productid:id,
        productname: username,
        productpic: filename,
        productcount:count,
        productprice:price,
        productadmin:admin
        // other fields as needed
      });
  
      await newUser.save();
      const res=await db.admin.updateOne({username:admin},{$inc:{selling:count},$push:{items:id}})
      console.log(res);
      console.log('User inserted successfully');
    } catch (error) {
      console.error('Error inserting user:', error);
    }
  }
  async function getNextSequenceValue(sequenceName) {
    const counter = await  db.counter.findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
  
    return counter.sequence_value;
  }
  async function decrement(id){
    try{
      const result= await db.product.findOneAndUpdate(
        {productid:id,
        productcount:{$gt:0}},
        {$inc:{productcount:-1}}
      )
      return result;
    }
    catch(error){
      console.log("Error",error);
    }
  }
  async function increment(user,userid){
    try{
      const filter={username:user}
      //const filter1={username:admin}
      const value={$inc:{number:1}}
      //const value1={$inc:{sold:1}}
      const result=await db.user.updateOne(filter,value);
      const result1=await db.admin.findOneAndUpdate({items:userid},{$inc:{sold:1}});
      console.log(result)
      console.log(result1);
      if(result){
        console.log("Incremented in user")
        if(result1){
          console.log("Incremented in Admin")
        }
        else{
          console.log("Some Error occured in Admin collection")
        }
      }
      else{
        console.log("Some error occured in User collection");
      }
    }
    catch(error){
      console.log("Error",error);
    }
  }

  const addproducts=async(user,product)=>{
    try{
    const variable=await db.user.findOne({username:user});
    if(variable){
      var arr=(variable.products);
      if (arr.includes(product)){
        
        console.log("Product already purchased");
      }
      else{
        variable.products.push(product);
        await variable.save();
        console.log("Product added successfully");
      }
    }
    else{
      console.log("User not found")
    }
  }
  catch(error){
    console.log("Error inserting product",error)
  }
  }
  
const numberofpurchase=async()=>{
  try{
  const result = await db.user.aggregate([
      {$sort:{"number":-1}},
      {$project:{
        _id:0,
        username:1
      }}
  ]);
  return result;
}
catch(error){
  console.log("Error wihile obtaining number of purchase based on users",error)
}
}

const numberofdiffproductspurchased=async()=>{
  try{
    const result=await db.user.aggregate([
      {
        $addFields: {
          productsCount: { $size: "$products" }
        }
      },
      {
        $sort: { "productsCount": -1 }
      },
      {
        $project: {
          _id:0,
    username:1
        }
      }

    ]);
    return result;
  }
  catch(error){
    console.log("Error loading on user purchased more different types of products",error);
  }
}

const topsellercount=async()=>{
  try{
  const result = await db.product.aggregate([
    {$lookup:
    {from:"admins",
  localField:"productadmin",
  foreignField:"username",
  as:"admindetails"
  }
  },
    {$unwind:"$admindetails"},
  {$sort:{"admindetails.sold":-1,"admindetails.selling":-1}},
    {$project:{
  _id:0,
  }}
  ]);
  return result;
}
catch(error){
  console.log("Error while obtaining number of purchase based on Admin",error)
}
}

const topsellernoproduct=async()=>{
  try{
    const result=await db.product.aggregate([
      {$lookup:
      {from:"admins",
    localField:"productadmin",
    foreignField:"username",
    as:"admindetails"
    }
    },
      {$unwind:"$admindetails"},
    {
        $addFields: {
          itemsCount: { $size: "$admindetails.items" } // Add the length of the items array
        }
      },
      {
        $sort: { "itemsCount": -1 } // Sort by the length of the items array in descending order
      },
      {$project:{
    _id:0,
    }},
    ]);
    return result
  }
  catch(error){
    console.log ("Error on Admin")   
  }
}

module.exports={
    insertUser,
    insertAdmin,
    insertProduct,
    findAdmin,
    findUser,
    findProduct,
    decrement,
    increment,
    addproducts,
    numberofpurchase,
    numberofdiffproductspurchased,
    topsellercount,
    topsellernoproduct
}

/*db.user.aggregate([
      {$sort:{"number":-1}},
      {$project:{
        _id:0,
        username:1
      }}
  ]);*/ 

/*sorting based on how many number of products a user purchased
db.users.aggregate([
  {
    $addFields: {
      productsCount: { $size: "$products" }
    }
  },
  {
    $sort: { "productsCount": -1 }
  },
  {
    $project: {
      _id:0,
username:1
    }
  }
]);

*/