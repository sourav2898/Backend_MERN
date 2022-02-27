const express = require('express');
const { createOrder, myOrders, getSignleOrder, getAllOrders, updateStatus, deleteOrder } = require('../controller/orderController');
const router = express.Router();

const {isAuthenticatedUser, isAuthoriseduser} = require('../middleware/auth');

router.route("/order/new").post(isAuthenticatedUser, createOrder);
router.route("/order/:id").get(isAuthenticatedUser,getSignleOrder);
router.route("/orders/myOrders").get(isAuthenticatedUser,myOrders);
router.route("/admin/orders").get(isAuthenticatedUser,isAuthoriseduser("admin"),getAllOrders);
router.route("/admin/orderUpdate/:id").put(isAuthenticatedUser,isAuthoriseduser("admin"),updateStatus)
                                      .delete(isAuthenticatedUser,isAuthoriseduser("admin"),deleteOrder);

module.exports = router;