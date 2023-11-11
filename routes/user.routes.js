//user routes
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.get('/', usersController.list);
router.get('/me', authMiddleware.isAuthenticated, usersController.getCurrentUser);//Falta Probar
router.get('/:id', usersController.getOne);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);


module.exports = router;
