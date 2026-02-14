const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const savedController = require("../controllers/savedController")

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(savedController.buildSavedList)
)

router.post(
  "/add",
  utilities.checkLogin,
  utilities.handleErrors(savedController.addSavedVehicle)
)

router.post(
  "/remove",
  utilities.checkLogin,
  utilities.handleErrors(savedController.deleteSavedVehicle)
)

module.exports = router
