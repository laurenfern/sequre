const router = require('express').Router()
const notificationTypesController = require('../controllers/notificationTypes.controller')
const validateBody = require('../filters/validate.body')
const notificationTypes = require('../models/notificationType')

module.exports = router

// api routes ===========================================================
router.get('/', notificationTypesController.readAll)
router.get('/:id([0-9a-fA-F]{24})', notificationTypesController.readById)
router.post('/', validateBody(notificationTypes), notificationTypesController.create)
router.put('/:id([0-9a-fA-F]{24})', validateBody(notificationTypes), notificationTypesController.update)
router.delete('/:id([0-9a-fA-F]{24})', notificationTypesController.delete)
