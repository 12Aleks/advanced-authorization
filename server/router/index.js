const Router = require('express');
const userController = require('../controllers/UserController');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth_middleware');

router.post('/registration',
    //express-validator
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 20 }),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activation);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

module.exports = router;