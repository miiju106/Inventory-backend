const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  supplierArray: [{ supplier: { type: String, required: true } }],
});

module.exports = mongoose.model("Supplier", supplierSchema);
