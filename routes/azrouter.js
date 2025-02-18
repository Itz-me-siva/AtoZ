const express = require("express");
const upload = require("../upload/upload");
const { addProduct, getAllProducts, getProductsByCategory, filterByPrice, updateProduct, deleteProduct } = require("../controller/azcontroller");

const router = express.Router();

router.post("/addProduct", upload.single("image"), addProduct);
router.get("/getAllProducts", getAllProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/filterByPrice", filterByPrice);
router.put("/updateProduct/:id", upload.single("image"), updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);

module.exports = router;
