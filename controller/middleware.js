const multer=require("multer");
const path=require("path");
const jwt=require("jsonwebtoken")
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET_ADMIN=process.env.JWT_SECRET_ADMIN;
const JWT_SECRET_USER=process.env.JWT_SECRET_USER;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join( __dirname,"../upload")); // Save uploaded files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
        const originalname = file.originalname.toLowerCase().split(' ').join('-');
        const filename = req.body.filename || originalname; // Use user-input filename or original filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+".png";
        console.log(filename+uniqueSuffix);
     cb(null, `${filename}-${uniqueSuffix}`);
      },
  });
  const upload = multer({ storage: storage });


    const authenticateAdmin = (Token1)=>(req, res, next) => {
        console.log(Token1);
        if (!Token1) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      
        jwt.verify(Token1, JWT_SECRET_ADMIN, (err, user) => {
          if (err) {
            return res.status(403).json({ message: 'Forbidden' });
          }
      
          req.user = user;
          next();
        });
      }
      const authenticateUser=(Token2) => (req, res, next) => {
        console.log(Token2);
        if (!Token2) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      
        jwt.verify(Token2, JWT_SECRET_USER, (err, user) => {
          if (err) {
            return res.status(403).json({ message: 'Forbidden' });
          }
      
          req.user = user;
          next();
        });
      }
      

module.exports={
    upload,
    authenticateAdmin,
    authenticateUser
}