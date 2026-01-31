const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// Inventory management view
router.get(
    "/",
    utilities.handleErrors(invController.buildManagement)
)

// Add classification view
router.get(
    "/add-classification",
    utilities.handleErrors(invController.buildAddClassification)
)

// Process add classification
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

// Add inventory view
router.get(
    "/add-inventory",
    utilities.handleErrors(invController.buildAddInventory)
)

// Process add inventory
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

// Route to build inventory by classification view
router.get(
    "/type/:classificationId",
    utilities.handleErrors(invController.buildByClassificationId)
);
router.get(
    "/detail/:inv_id",
    utilities.handleErrors(invController.buildDetail)
)

module.exports = router;
