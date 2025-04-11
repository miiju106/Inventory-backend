const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    supplier: { type: String, required: true },
    stockId: { type: String, required: true },
    sold: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sales", salesSchema);
