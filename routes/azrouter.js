const express = require("express");
const upload = require("../upload/upload");
const { addProduct, getAllProducts, getProductsByCategory, filterByPrice, updateProduct, deleteProduct, Signup, Login,getProfile, updateProfile, Auth } = require("../controller/azcontroller");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/signup",upload.single("image"), Signup);
router.post("/login", Login);
router.get("/protected-route", authMiddleware, Auth);
router.post("/addProduct", upload.single("image"), addProduct);
router.get("/getAllProducts", getAllProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/filterByPrice", filterByPrice);
router.put("/updateProduct/:id", upload.single("image"), updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);
router.post("/getProfile/:id", getProfile);
router.put("/updateProfile/:id", updateProfile);

module.exports = router;