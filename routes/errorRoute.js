const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")
const utilities = require("../utilities")

const intentionalError = (req, res, next) => {
    const err = new Error("Intentional server error for testing.")
    err.status = 500
    next(err)
}

router.get(
    "/error",
    utilities.handleErrors(errorController.triggerError),
    intentionalError
)

module.exports = router
