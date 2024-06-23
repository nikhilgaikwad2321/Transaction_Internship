const express = require('express');
const router = express.Router();
const Item = require('../model/ProductModel');

//to create a chart
router.get('/price-range/:month', async (req, res) => {
  try {
    const month = parseInt(req.params.month, 10);
    const items = await Item.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, month] }
        }
      },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
          default: "901-above",
          output: {
            count: { $sum: 1 }
          }
        }
      },
      {
        $project: {
          range: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 0] }, then: "0-100" },
                { case: { $eq: ["$_id", 100] }, then: "101-200" },
                { case: { $eq: ["$_id", 200] }, then: "201-300" },
                { case: { $eq: ["$_id", 300] }, then: "301-400" },
                { case: { $eq: ["$_id", 400] }, then: "401-500" },
                { case: { $eq: ["$_id", 500] }, then: "501-600" },
                { case: { $eq: ["$_id", 600] }, then: "601-700" },
                { case: { $eq: ["$_id", 700] }, then: "701-800" },
                { case: { $eq: ["$_id", 800] }, then: "801-900" },
                { case: { $eq: ["$_id", "901-above"] }, then: "901-above" },
              ],
              default: "unknown"
            }
          },
          count: 1
        }
      }
    ]);
    console.log(items);

    res.render("chart.ejs",{ items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//for pie chart
router.get('/categories/:month', async (req, res) => {
    try {
      const month = parseInt(req.params.month, 10);
      const items = await Item.aggregate([
        {
          $match: {
            $expr: { $eq: [{ $month: "$dateOfSale" }, month] }
          }
        },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            category: "$_id",
            count: 1,
            _id: 0
          }
        }
      ]);
      // Prepare the response object
      const response = {
        categories: items
      };

      res.render('piechart.ejs', { response });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
