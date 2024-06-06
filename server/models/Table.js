const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tableNumber: { type: Number, required: true },
  status: { type: String, required: true }
});

module.exports = mongoose.model('Table', TableSchema);
