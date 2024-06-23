const express = require('express');
const router = express.Router();
const Item = require('../model/ProductModel');

// Statistics route
router.get('/:month', async (req, res) => {
  try {
    const month = parseInt(req.params.month, 10);

    // Total sale amount of selected month
    const totalSaleAmountAggregate = await Item.aggregate([
      {
        $match: {
          sold: true,
          $expr: { $eq: [{ $month: "$dateOfSale" }, month] }
        }
      },
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: "$price" }
        }
      }
    ]);
    const totalSaleAmount = totalSaleAmountAggregate.length > 0 ? totalSaleAmountAggregate[0].totalSaleAmount : 0;

    // Total number of sold items of selected month
    const totalSoldItems = await Item.countDocuments({
      sold: true,
      $expr: { $eq: [{ $month: "$dateOfSale" }, month] }
    });

    // Total number of not sold items of selected month
    const totalNotSoldItems = await Item.countDocuments({
      sold: false,
      $expr: { $eq: [{ $month: "$dateOfSale" }, month] }
    });
    const statistics = {
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems
    };

    
    res.render('statistics.ejs', { statistics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
