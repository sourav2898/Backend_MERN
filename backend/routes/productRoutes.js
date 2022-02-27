const express = require('express');
const { getAllProducts, createProduct, updateProduct, delteProduct, getProduct, createUserReview, deleteReview, getProductReviews } = require('../controller/productController');
const { isAuthenticatedUser, isAuthoriseduser } = require('../middleware/auth');

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/products/new").post( isAuthenticatedUser, isAuthoriseduser("admin"),createProduct);
router.route("/admin/products/:id").put(isAuthenticatedUser, isAuthoriseduser("admin"), updateProduct)
                             .delete(isAuthenticatedUser, isAuthoriseduser("admin"),delteProduct);
router.route("/products/:id").get(getProduct);
router.route("/review").put(isAuthoriseduser,createUserReview);
router.route("/reviews").get(getProductReviews).delete(isAuthoriseduser,deleteReview);

module.exports = router;