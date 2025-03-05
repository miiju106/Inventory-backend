const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryArray: [{ category: { type: String, required: true,} }],
});

module.exports = mongoose.model("Category", categorySchema);
