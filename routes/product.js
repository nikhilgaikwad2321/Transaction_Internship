const express = require('express');
const router = express.Router();
const Product = require('../model/ProductModel');

// GET /products
router.get('/', async (req, res) => {
    const { search, page = 1, perPage = 10 } = req.query;
    const query = {};

    if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$or = [
            { title: searchRegex },
            { description: searchRegex },
            { price: parseFloat(search) || 0 }
        ];
    }

    try {
        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage))
            .exec();

        res.render('products.ejs', {
            success: true,
            total,
            page: parseInt(page),
            perPage: parseInt(perPage),
            products
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
