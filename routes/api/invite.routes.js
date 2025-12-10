const express=require('express');
const router=express.Router();
const inviteControllers=require('../../controllers/invite.controller')
const auth=require('../../middleware/auth')
const roleCheck=require('../../middleware/role-check')


router.post('/',auth,inviteControllers.createInvite)


module.exports=router