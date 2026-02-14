const utilities = require("../utilities")
const savedModel = require("../models/saved-model")
const invModel = require("../models/inventory-model")

const savedController = {}

function getSafeReturnPath(value) {
  if (typeof value === "string" && value.startsWith("/")) {
    return value
  }
  return "/saved"
}

function parseId(value) {
  const id = parseInt(value, 10)
  return Number.isInteger(id) ? id : null
}

/* ****************************************
 *  Build saved vehicles view
 * *************************************** */
savedController.buildSavedList = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const account_id = parseId(res.locals.accountData?.account_id)
    if (!account_id) {
      req.flash("notice", "Please log in.")
      return res.redirect("/account/login")
    }
    const savedVehicles = await savedModel.getSavedVehiclesByAccountId(account_id)

    return res.render("account/saved", {
      title: "Wish List",
      nav,
      errors: null,
      savedVehicles
    })
  } catch (error) {
    return next(error)
  }
}

/* ****************************************
 *  Save vehicle for account
 * *************************************** */
savedController.addSavedVehicle = async function (req, res, next) {
  try {
    const account_id = parseId(res.locals.accountData?.account_id)
    const inv_id = parseId(req.body.inv_id)
    const returnTo = getSafeReturnPath(req.body.returnTo)

    if (!account_id || !inv_id) {
      req.flash("notice", "Invalid account or vehicle selection.")
      return res.redirect(returnTo)
    }

    const vehicle = await invModel.getVehicleById(inv_id)
    if (!vehicle) {
      req.flash("notice", "Vehicle not found.")
      return res.redirect(returnTo)
    }

    const addResult = await savedModel.saveVehicle(account_id, inv_id)
    if (addResult) {
      req.flash("notice", "Vehicle added to your wish list.")
    } else {
      req.flash("notice", "Vehicle is already in your wish list.")
    }
    return res.redirect(returnTo)
  } catch (error) {
    return next(error)
  }
}

/* ****************************************
 *  Remove vehicle from saved list
 * *************************************** */
savedController.deleteSavedVehicle = async function (req, res, next) {
  try {
    const account_id = parseId(res.locals.accountData?.account_id)
    const inv_id = parseId(req.body.inv_id)
    const returnTo = getSafeReturnPath(req.body.returnTo)

    if (!account_id || !inv_id) {
      req.flash("notice", "Invalid account or vehicle selection.")
      return res.redirect(returnTo)
    }

    const removeResult = await savedModel.removeSavedVehicle(account_id, inv_id)
    if (removeResult) {
      req.flash("notice", "Vehicle removed from your wish list.")
    } else {
      req.flash("notice", "Vehicle was not in your wish list.")
    }
    return res.redirect(returnTo)
  } catch (error) {
    return next(error)
  }
}

savedController.removeSavedVehicle = savedController.deleteSavedVehicle

module.exports = savedController
