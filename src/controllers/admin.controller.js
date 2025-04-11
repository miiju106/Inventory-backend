const Stock = require("../models/stock.model");
const User = require("../models/user.model");
const Sales = require("../models/sales.model");
const Category = require("../models/category.model");
const Supplier = require("../models/supplier.model");

async function addStock(req, res) {
  try {
    const { itemName, category, qty, price, supplier, available, sold } =
      req.body;

    const savedUser = await User.findById(req.user.userId); // userId is from JWT payload

    if (!savedUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (savedUser.role != "admin") {
      return res.status(400).json({
        message: "Admin is only given the access to post a stock",
      });
    }

    if (!itemName) {
      return res.status(400).json({
        message: "name of the item is required",
      });
    }

    if (!category) {
      return res.status(400).json({
        message: "name of the category is required",
      });
    }
    if (Number.isNaN(qty) || !qty) {
      return res.status(400).json({
        message: "quantity is required and it must be a number",
      });
    }
    if (Number.isNaN(price) || !price) {
      return res.status(400).json({
        message: "price is required and it must be a number",
      });
    }

    if (!supplier) {
      return res.status(400).json({
        message: "name of supplier is required",
      });
    }

    if (savedUser.role !== "admin") {
      return res.status(400).json({
        message: "only an admin can post a stock",
      });
    }

    //create new Stock
    const stock = new Stock({
      itemName,
      category,
      qty,
      price,
      supplier,
      available,
      sold,
    });

    const savedStock = await stock.save();

    // respond
    res.status(201).json({
      message: "Stock Created Successfully",
      stock: {
        itemName: savedStock.itemName,
        category: savedStock.category,
        qty: savedStock.qty,
        price: savedStock.price,
        supplier: savedStock.supplier,
        available: savedStock.available,
        sold: savedStock.sold,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" }, error);
  }
}

async function updateStock(req, res) {
  try {
    const { id } = req.params;

    const savedUser = await User.findById(req.user.userId);

    if (!savedUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (savedUser.role !== "admin") {
      return res.status(400).json({
        message: "Admin is only given the access to update a stock",
      });
    }

    // Update the stock directly in the database
    const updatedStock = await Stock.findByIdAndUpdate(id, req.body, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures the update follows schema validation
    });

    if (!updatedStock) {
      return res.status(400).json({ message: "Stock not found" });
    }

    // respond
    res.status(200).json({
      message: "Stock updated successfully",
      updatedStock,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

async function deleteStock(req, res) {
  try {
    const { id } = req.params;
    const savedUser = await User.findById(req.user.userId);

    if (!savedUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (savedUser.role !== "admin") {
      return res.status(400).json({
        message: "Admin is only given the access to delete a stock",
      });
    }

    const deletedStock = await Stock.findByIdAndDelete(id);

    if (!deletedStock) {
      return res.status(400).json({ message: "Stock not found" });
    }

    //respond
    res
      .status(200)
      .json({ message: "Stock deleted successfully", deletedStock });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

async function addCategory(req, res) {
  try {
    const { category } = req.body;
    const savedUser = await User.findById(req.user.userId); // userId is from JWT payload

    if (!savedUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (savedUser.role != "admin") {
      return res.status(400).json({
        message: "Admin is only given the access to add Category",
      });
    }

    // Find the first category document (assuming you have one main document for all categories)
    let categoryDoc = await Category.findOne();

    if (!categoryDoc) {
      // If no category document exists, create a new one
      categoryDoc = new Category({ categoryArray: [{ category }] });
    } else {
      // Check if the category already exists before pushing
      if (
        categoryDoc.categoryArray.some(
          (list) => list.category.toLowerCase() === category.toLowerCase()
        )
      ) {
        return res.status(400).json({ message: "Category already exists" });
      } else {
        categoryDoc.categoryArray.push({ category });
      }
    }

    // save to database
    await categoryDoc.save();

    //respond
    res.status(200).json({
      message: "Category Added successfully",
      categories: categoryDoc.categoryArray,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    const savedUser = await User.findById(req.user.userId); // userId is from JWT payload

    if (!savedUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (savedUser.role != "admin") {
      return res.status(400).json({
        message: "Admin is only given the access to delete Category",
      });
    }

    // Find the first category document (assuming you have one main document for all categories)
    const categoryDoc = await Category.findOne();
    const matchIndex = categoryDoc.categoryArray.findIndex(
      (list) => list._id == id
    );

    if (matchIndex === -1) {
      return res.status(400).json({
        message: "Category not found",
      });
    }

    // remove one item at matchIndex
    categoryDoc.categoryArray.splice(matchIndex, 1);

    // save to database
    await categoryDoc.save();

    // respond
    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

async function getCategory(req, res) {
  try {
    const savedUser = await User.findById(req.user.userId); // userId is from JWT payload

    if (!savedUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (savedUser.role != "admin") {
      return res.status(400).json({
        message: "Admin is only given the access to add Category",
      });
    }

    // Find the first category document (assuming you have one main document for all categories)
    const categoryDoc = await Category.findOne();

    //respond
    res.status(200).json({
      message: "Access Granted",
      categories: categoryDoc.categoryArray,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

async function addSupplier(req, res) {
  try {
    const { supplier } = req.body;
    const savedUser = await User.findById(req.user.userId); // userId is from JWT payload

    if (!savedUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (savedUser.role != "admin") {
      return res.status(400).json({
        message: "Admin is only given the access to add Supplier",
      });
    }

    // Find the first supplier document (assuming you have one main document for all suppliers)
    let SupplierDoc = await Supplier.findOne();

    if (!SupplierDoc) {
      // If no supplier document exists, create a new one
      SupplierDoc = new Supplier({ supplierArray: [{ supplier }] });
    } else {
      // Check if the supplier already exists before pushing
      if (
        SupplierDoc.supplierArray.some(
          (list) => list.supplier.toLowerCase() === supplier.toLowerCase()
        )
      ) {
        return res.status(400).json({ message: "Category already exists" });
      } else {
        SupplierDoc.supplierArray.push({ supplier });
      }
    }

    // save to database
    await SupplierDoc.save();

    // respond
    res.status(200).json({
      message: "Supplier Created successfully",
      suppliers: SupplierDoc.supplierArray,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

async function deleteSupplier(req, res) {
  try {
    const { id } = req.params;
    const savedUser = await User.findById(req.user.userId); // userId is from JWT payload

    if (!savedUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (savedUser.role != "admin") {
      return res.status(400).json({
        message: "Admin is only given the access to delete Supplier",
      });
    }

    // Find the first supplier document (assuming you have one main document for all suppliers)
    const supplierDoc = await Supplier.findOne();

    const matchIndex = supplierDoc.supplierArray.findIndex(
      (list) => list._id == id
    );

    if (matchIndex === -1) {
      return res.status(400).json({
        message: "Supplier not found",
      });
    }

    supplierDoc.supplierArray.splice(matchIndex, 1);

    // save to database
    await supplierDoc.save();

    // respond
    res.status(200).json({
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

async function getSupplier(req, res) {
  try {
    const savedUser = await User.findById(req.user.userId);

    if (!savedUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (savedUser.role != "admin") {
      return res.status(400).json({
        message: "Admin is only given the access to get supplier",
      });
    }

    // Find the first supplier document (assuming you have one main document for all suppliers)
    const supplierDoc = await Supplier.findOne();

    // respond
    res.status(200).json({
      message: "Access Granted",
      suppliers: supplierDoc.supplierArray,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

async function buyStocks(req, res) {
  try {
    const { id } = req.params;
    const { qty } = req.body;

    const savedUser = await User.findById(req.user.userId);
    if (!savedUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (!qty) {
      return res.status(400).json({
        message: "number of quantity is required",
      });
    }

    const selectedUser = await Stock.findById(id);

    if (qty > selectedUser.qty) {
      return res.status(400).json({
        message: `Quantity is not available, Only ${selectedUser.qty} stock${
          selectedUser.qty > 1 ? "s" : ""
        } ${selectedUser.qty > 1 ? "are" : "is"} available`,
      });
    }
    // console.log("selectedUser", selectedUser)

    //create new Sales
    const soldStock = new Sales({
      itemName: selectedUser.itemName,
      stockId: id,
      category: selectedUser.category,
      qty: qty > selectedUser.qty ? 0 : qty,
      price: qty * selectedUser.price,
      supplier: selectedUser.supplier,
      sold: true,
    });

    const savedStock = await soldStock.save();
    console.log("savedStock", savedStock);

    // respond
    res.status(200).json({
      message: "Stock Sold Successfully",
      stock: savedStock,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

async function soldStocks(req, res) {
  try {
    const savedUser = await User.findById(req.user.userId);

    if (!savedUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (savedUser.role != "admin") {
      return res.status(400).json({
        message: "Admin is only given the access to get sold stocks",
      });
    }

    // get all sold stocks
    const soldStocks = await Sales.find();

    res.status(200).json({
      message: "Access Granted",
      stocks: soldStocks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" }, error);
  }
}

module.exports = {
  addStock,
  updateStock,
  deleteStock,
  addCategory,
  deleteCategory,
  getCategory,
  addSupplier,
  deleteSupplier,
  getSupplier,
  buyStocks,
  soldStocks,
};
