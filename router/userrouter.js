const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const router = express.Router();


router.post('/singup',authController.singup);
router.post('/login',authController.login);
router.get('/logout',authController.logout);

router.post('/forgetPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);

router.use(authController.protect)
router.patch('/updatePassword',authController.updatePassword);
router.
patch('/updateMe',
userController.uploadUserimage,
userController.resizeUserPhoto,
userController.updateMe);

router.delete('/deleteMe',userController.deleteMe);
router.get('/me',userController.getMe,userController.getUser);

router.use(authController.restrictTo('admin'))

router
.route('/')
.get(userController.getAllUser)
.post(userController.createUser)

router.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);

module.exports = router;