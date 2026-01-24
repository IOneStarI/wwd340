const errorController = {}

errorController.triggerError = async function(req, res, next) {
    next()
}

module.exports = errorController
