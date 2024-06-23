const express = require('express');
const router = express.Router();
const axios = require('axios');




// Combining all responses route to generate responses
router.get('/:month', async (req, res) => {
  try {
    const month = req.params.month;

    // Fetching data from all three APIs through axios
    const [priceRangeResponse, categoriesResponse, statisticsResponse] = await Promise.all([
      axios.get(`http://localhost:8080/products/bar-chart/price-range/${month}`),
      axios.get(`http://localhost:8080/products/bar-chart/categories/${month}`),
      axios.get(`http://localhost:8080/products/statistics/${month}`)
    ]);

    console.log('Price Range Response:', priceRangeResponse.data);
    console.log('Categories Response:', categoriesResponse.data);
    console.log('Statistics Response:', statisticsResponse.data);
    
    // Extracting data from each response
    const priceRanges = priceRangeResponse.data.items;
    const categories = categoriesResponse.data.response;
    const statistics = statisticsResponse.data.statistics;

    // Constructing the combined response object
    const combinedResponse = {
      priceRanges: priceRanges,
      categories: categories,
      statistics: statistics
    };

    res.render('combined.ejs',{ combinedResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
});

module.exports = router;
