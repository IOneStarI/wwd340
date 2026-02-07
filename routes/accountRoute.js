const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Deliver account management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

// Deliver login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// Deliver registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Deliver account update view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

// Process account update
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password change
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.updatePasswordRules(),
  regValidate.checkPasswordUpdate,
  utilities.handleErrors(accountController.updatePassword)
)

// Logout
router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)
module.exports = router
