//test routes
const express = require('express');
const router = express.Router();
const testController = require('../controllers/test.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', testController.getAll);
router.post('/create', authMiddleware.isAuthenticated, testController.create);
router.get('/:id', testController.getOne);
router.put('/:id', authMiddleware.isAuthenticated, testController.update);
router.delete('/:id', authMiddleware.isAuthenticated, testController.delete);
router.get('/course/:id', testController.getTestsByCourse);



module.exports = router;


