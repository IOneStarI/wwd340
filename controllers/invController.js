const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null
    })
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function(req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

invCont.buildDetail = async function(req, res) {
    const inv_id = req.params.inv_id
    const data = await invModel.getVehicleById(inv_id)
    const nav = await utilities.getNav()
    const vehicleHTML = utilities.buildVehicleDetail(data)

    res.render("inventory/detail", {
        title: `${data.inv_make} ${data.inv_model}`,
        nav,
        vehicleHTML
    })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null
    })
}

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async function(req, res, next) {
    const { classification_name } = req.body
    const addResult = await invModel.addClassification(classification_name)
    if (addResult) {
        let nav = await utilities.getNav()
        req.flash("notice", `Classification "${classification_name}" added successfully.`)
        res.status(201).render("./inventory/management", {
            title: "Inventory Management",
            nav,
            errors: null
        })
    } else {
        let nav = await utilities.getNav()
        req.flash("notice", "Sorry, the classification could not be added.")
        res.status(500).render("./inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null,
            classification_name
        })
    }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function(req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: null
    })
}

/* ***************************
 *  Process add inventory item
 * ************************** */
invCont.addInventory = async function(req, res, next) {
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

    const addResult = await invModel.addInventoryItem(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )

    if (addResult) {
        let nav = await utilities.getNav()
        req.flash("notice", "Inventory item added successfully.")
        res.status(201).render("./inventory/management", {
            title: "Inventory Management",
            nav,
            errors: null
        })
    } else {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        req.flash("notice", "Sorry, the inventory item could not be added.")
        res.status(500).render("./inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            errors: null,
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
    }
}

module.exports = invCont
