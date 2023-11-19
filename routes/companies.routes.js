//companys routes
const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary.config');
const companiesController = require('../controllers/companies.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', companiesController.getAll);
router.post('/create', authMiddleware.isAuthenticated, upload.single('logo'), companiesController.create);
router.get('/:id', companiesController.getOne);
router.put('/:id', authMiddleware.isAuthenticated, upload.single('logo'), companiesController.update);
router.delete('/:id', authMiddleware.isAuthenticated, companiesController.delete);

module.exports = router;
