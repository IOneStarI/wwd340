const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// Inventory management view
router.get(
    "/",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildManagement)
)

// Add classification view
router.get(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddClassification)
)

// Process add classification
router.post(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkAccountType,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

// Add inventory view
router.get(
    "/add-inventory",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddInventory)
)

// Process add inventory
router.post(
    "/add-inventory",
    utilities.checkLogin,
    utilities.checkAccountType,
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

// Return inventory data as JSON by classification
router.get(
    "/getInventory/:classification_id",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.getInventoryJSON)
)

// Build edit inventory view
router.get(
    "/edit/:inv_id",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.editInventoryView)
)

// Process inventory update
router.post(
    "/update",
    utilities.checkLogin,
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Build delete confirmation view
router.get(
    "/delete/:inv_id",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildDeleteConfirm)
)

// Process inventory deletion
router.post(
    "/delete",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;
