const express = require("express");
const { Sequelize, DataTypes } = require('sequelize');
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const nodemailer = require("nodemailer");

const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(fileUpload());

// Configure Sequelize to connect to PostgreSQL
const sequelize = new Sequelize('ecommerce', 'postgres', 'qwert@123', {
    host: 'localhost',
    dialect: 'postgres',
});

// Define File model
const File = sequelize.define('File', {
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    filepath: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    uploadedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

// Ensure that the model is synced with the database
sequelize.sync({ force: true }).then(() => {
    console.log("File model synced with the database");
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gerald.briyolan2002@gmail.com',
    pass: 'zxuy ltvq zhjr tqip'
    },
});

 //Configures Nodemailer to use Gmail
const sendEmail = (email, subject, text) => {
    const mailOptions = {
        from: 'gerald.briyolan2002@gmail.com',
        to: email,
        subject: subject,
        text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};

// API Endpoint to test if server is running
app.get("/", (req, res) => {
    res.send("App is running");
});

// Handle file upload
app.post('/upload', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {   //Object.keys check if there are any files uploaded in the request
            return res.status(400).json({
                success: 0,
                error: 'No files were uploaded',
            });
        }

        let uploadedFile = req.files.file;
        let uploadPath = path.join(__dirname, 'upload', 'images', uploadedFile.name);

        // Move the file to the desired directory
        uploadedFile.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(500).json({
                    success: 0,
                    error: err.message,
                });
            }

            // Save file metadata to the database
            const newFile = await File.create({
                filename: uploadedFile.name,
                filepath: uploadPath,
            });

            res.json({
                success: 1,
                image_url: `http://localhost:${port}/image/${newFile.filename}`,
            });
        });
    } catch (error) {
        res.status(500).json({
            success: 0,
            error: error.message,
        });
    }
});

// Serve static files from the 'upload/images' directory
app.use('/image', express.static(path.join(__dirname, 'upload', 'images')));

// Define Product model
const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,  
        allowNull: false,
        primaryKey: true 
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    new_price: {
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
    old_price: {
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
});

//Add product
app.post('/addproduct', async (req, res) => {
    let products = await Product.findAll({});
    let id;

    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    } else {
        id = 1;
    }

    const product = await Product.create({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });

    await product.save();
    res.json({
        success: true,
        name: req.body.name,
    });
});

// Delete product
app.post('/removeproduct', async (req, res) => {
    try {
        const result = await Product.destroy({
            where: {
                id: req.body.id
            }
        });

        if (result) {
            res.json({
                success: true,
                message: `Product with id ${req.body.id} removed successfully`
            });
        } else {
            res.status(404).json({
                success: false,
                message: `Product with id ${req.body.id} not found`
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// Get all products
app.get('/allproducts', async (req, res) => {
    let products = await Product.findAll({});
    res.send(products);
});

// Define Users model
const Users = sequelize.define('Users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cartData: {
        type: DataTypes.JSON,
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

// User signup
app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ where: { email: req.body.email } });
    if (check) {
        return res.status(400).json({ success: false, errors: "Existing User Found!! Same Email!!" });
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    });
    await user.save();
    const data = {
        user: {
            id: user.id
        }
    };
    const token = jwt.sign(data, 'secret_ecom');
    
    // Send signup email
    sendEmail(user.email, 'Signup Successful', 'You have successfully signed up for an account.');
    
    res.json({ success: true });
});

// User login
app.post('/login', async (req, res) => {
    try {
        let user = await Users.findOne({ where: { email: req.body.email } });

        if (user) {
            const passCompare = req.body.password === user.password;

            if (passCompare) {
                const data = {
                    user: {
                        id: user.id
                    }
                };
                const token = jwt.sign(data, 'secret_ecom');
                
                // Send login email
                sendEmail(user.email, 'Login Notification', 'You have successfully logged in to your account.');
                
                return res.json({ success: true, token });
            } else {
                return res.json({ success: false, errors: "Wrong Password" });
            }
        } else {
            return res.json({ success: false, errors: "Wrong Email-id" });
        }
    } catch (error) {
        return res.json({ success: false, errors: "Server Error" });
    }
});

//new collection
app.get('/newcollections', async (req, res) => {
    try {
      let products = await Product.findAll({});
      let newCollection = products.slice(1).slice(-8);
      console.log("New collection fetched");
      res.send(newCollection);
    } catch (error) {
      console.error("Error fetching new collection:", error);
      res.status(500).send({ error: 'Failed to fetch new collection' });
    }
});

// Middleware to fetch user from token
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate" });
    } else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            return res.status(401).send({ errors: "Please authenticate" });
        }
    }
};

// End point for remove product from cart
// app.post('/removefromcart', fetchUser, async (req, res) => {
//     console.log(req.body.itemId);
//     let userData = await Users.findOne({_id: req.user.id})
//     if (userData.cartData[req.body.itemId] > 0)
//         userData.cartData[req.body.itemId] -= 1
//     await Users.findOneAndUpdate({_id: req.user.id}, {cartData: userData.cartData})
//     res.send("removed")
// });  

// Start the server
app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port", port);
    } else {
        console.log("Error:", error);
    }
});
