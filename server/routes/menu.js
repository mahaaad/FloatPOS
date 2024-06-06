// const router = require('express').Router();
// const MenuItem = require('../models/MenuItem');
// const verifyToken = require('../verifyToken');

// // Create a new menu item
// router.post('/items', verifyToken, async (req, res) => {
//   const newItem = new MenuItem({
//     userId: req.user._id,
//     itemName: req.body.itemName,
//     price: req.body.price
//   });

//   try {
//     const savedItem = await newItem.save();
//     res.status(201).json(savedItem);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // Get all menu items for a user
// router.get('/items', verifyToken, async (req, res) => {
//   try {
//     const items = await MenuItem.find({ userId: req.user._id });
//     res.status(200).json(items);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// module.exports = router;
