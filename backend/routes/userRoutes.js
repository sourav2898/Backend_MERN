const express = require('express');
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateUserDetails, getAllUsers, getSingleUser, updateUserDetailsByAdmin, deleteUserByAdmin } = require('../controller/userController');
const { isAuthenticatedUser, isAuthoriseduser } = require('../middleware/auth');

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/myDetails").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/myDetails/update").put(isAuthenticatedUser, updateUserDetails);

router.route("/admin/users").get(isAuthenticatedUser,isAuthoriseduser("admin"),getAllUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser,isAuthoriseduser("admin"),getSingleUser)
                                .put(isAuthenticatedUser,isAuthoriseduser("admin"),updateUserDetailsByAdmin)
                                .delete(isAuthenticatedUser,isAuthoriseduser("admin"),deleteUserByAdmin);

module.exports = router;