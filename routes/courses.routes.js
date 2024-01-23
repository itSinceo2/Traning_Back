// courses routes
const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/courses.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../config/cloudinary.config');


router.get('/', coursesController.getAll);
router.post('/create', authMiddleware.isAuthenticated, upload.single('mainImage'), coursesController.create);
router.get('/:id', coursesController.getOne);
router.put('/:id', authMiddleware.isAuthenticated, upload.single('image'), coursesController.update);
router.put('/:id/content', authMiddleware.isAuthenticated, upload.single('image'), coursesController.updateContent);
router.put('/:id/image', authMiddleware.isAuthenticated, upload.single('image'), coursesController.updateContentImage);
//actualizando la lista de estudiantes
router.put('/:id/updateStudent', authMiddleware.isAuthenticated, coursesController.updateCourseStudent);
router.delete('/:id', authMiddleware.isAuthenticated, coursesController.delete);

module.exports = router;