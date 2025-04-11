const express = require("express")
const {addStock, updateStock, deleteStock, addCategory, deleteCategory, getCategory, addSupplier, deleteSupplier, getSupplier, buyStocks, soldStocks} = require("../controllers/admin.controller")
const verifyJWT = require("../middlewares/verifyJWT")
const adminRouter = express.Router()

adminRouter.post("/add-stock", verifyJWT, addStock)
adminRouter.put("/update-stock/:id", verifyJWT, updateStock)
adminRouter.delete("/delete-stock/:id", verifyJWT, deleteStock)
adminRouter.post("/add-category", verifyJWT, addCategory)
adminRouter.delete("/delete-category/:id", verifyJWT, deleteCategory)
adminRouter.get("/get-category", verifyJWT, getCategory)
adminRouter.post("/add-supplier", verifyJWT, addSupplier)
adminRouter.delete("/delete-supplier/:id", verifyJWT, deleteSupplier)
adminRouter.get("/get-supplier", verifyJWT, getSupplier)
adminRouter.post("/buy-stock/:id", verifyJWT, buyStocks)
adminRouter.get("/get-sold-stock", verifyJWT, soldStocks)


module.exports = adminRouter