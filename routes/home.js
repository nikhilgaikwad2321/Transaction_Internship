const express = require('express');
const axios = require('axios');
const transactionModel = require('../model/ProductModel');

const router = express.Router();

router.get('/',async (req,res)=>{
    
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;

        // Removing the data which alredy present
        await transactionModel.deleteMany({});

        // adding fetched data 
        await transactionModel.insertMany(data);

        res.send('Database initialized with seed data.');
    } 
    catch (error) {
        console.error(error);
        res.send('An error occurred while initializing the database.');
    }
});


module.exports=router;