//companys routes
const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config');
const companysController = require('../controllers/companys.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', companysController.getAll);
router.post('/create', authMiddleware.isAuthenticated, upload.single('logo'), companysController.create);
router.get('/:id', companysController.getOne);
router.put('/:id', authMiddleware.isAuthenticated, upload.single('logo'), companysController.update);
router.delete('/:id', authMiddleware.isAuthenticated, companysController.delete);

module.exports = router;
