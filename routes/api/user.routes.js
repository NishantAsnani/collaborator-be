const express=require('express');
const router=express.Router()
const authControllers=require('../../controllers/auth.controller')
const userControllers=require('../../controllers/user.controller')
const auth=require('../../middleware/auth')


router.get('/',auth,userControllers.getAllUsers)

router.get('/:id',auth,userControllers.getUserById)

router.post('/login',authControllers.Login)

router.post('/signup',authControllers.Signup)

router.patch('/:id',auth,userControllers.editUser)

router.delete('/:id',auth,userControllers.deleteUser)    



module.exports=router
