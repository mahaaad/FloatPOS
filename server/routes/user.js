// const router = require('express').Router();
// const Table = require('../models/Table');
// const verifyToken = require('../verifyToken');

// // Create a new table
// router.post('/tables', verifyToken, async (req, res) => {
//   const newTable = new Table({
//     userId: req.user._id,
//     tableNumber: req.body.tableNumber,
//     status: req.body.status
//   });

//   try {
//     const savedTable = await newTable.save();
//     res.status(201).json(savedTable);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // Get all tables for a user
// router.get('/tables', verifyToken, async (req, res) => {
//   try {
//     const tables = await Table.find({ userId: req.user._id });
//     res.status(200).json(tables);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// module.exports = router;
