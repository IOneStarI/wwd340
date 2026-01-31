const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* ******************************
 * Classification Data Rules
 * ***************************** */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .isAlphanumeric()
      .withMessage("Classification name must be letters and numbers only (no spaces or special characters).")
  ]
}

/* ******************************
 * Inventory Data Rules
 * ***************************** */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Please choose a classification."),

    body("inv_make")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .matches(/^[A-Za-z0-9\s'-]+$/)
      .withMessage("Make is required (min 3 characters) and may only contain letters, numbers, spaces, hyphens, and apostrophes."),

    body("inv_model")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .matches(/^[A-Za-z0-9\s'-]+$/)
      .withMessage("Model is required (min 3 characters) and may only contain letters, numbers, spaces, hyphens, and apostrophes."),

    body("inv_year")
      .trim()
      .notEmpty()
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Year is required and must be a 4-digit year."),

    body("inv_description")
      .trim()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Description is required and must be at least 10 characters."),

    body("inv_image")
      .trim()
      .notEmpty()
      .matches(/^\/images\/vehicles\/.+\.(jpg|jpeg|png|gif)$/i)
      .withMessage("Image path must point to /images/vehicles/ and end with an image extension."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .matches(/^\/images\/vehicles\/.+\.(jpg|jpeg|png|gif)$/i)
      .withMessage("Thumbnail path must point to /images/vehicles/ and end with an image extension."),

    body("inv_price")
      .trim()
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Price is required and must be a positive number."),

    body("inv_miles")
      .trim()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Miles is required and must be 0 or more."),

    body("inv_color")
      .trim()
      .notEmpty()
      .matches(/^[A-Za-z\s'-]+$/)
      .withMessage("Color is required and may only contain letters, spaces, hyphens, and apostrophes.")
  ]
}

/* ******************************
 * Check classification data
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name
    })
    return
  }
  next()
}

/* ******************************
 * Check inventory data
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })
    return
  }
  next()
}

module.exports = validate
