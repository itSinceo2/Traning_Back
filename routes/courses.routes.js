// courses routes
const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/courses.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../config/multer.config');

router.get('/', coursesController.getAll);
router.post('/create', authMiddleware.isAuthenticated, upload.single('image'), coursesController.create);
router.get('/:id', coursesController.getOne);
router.put('/:id', authMiddleware.isAuthenticated, upload.single('image'), coursesController.update);
router.delete('/:id', authMiddleware.isAuthenticated, coursesController.delete);

module.exports = router;