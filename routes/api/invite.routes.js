const express=require('express');
const router=express.Router();
const inviteControllers=require('../../controllers/invite.controller')
const auth=require('../../middleware/auth')
const roleCheck=require('../../middleware/role-check')
const optionalAuth=require('../../middleware/optionalAuth')

router.get('/:token',optionalAuth,inviteControllers.checkTokenInvite)

router.post('/',auth,inviteControllers.createInvite)

router.post('/accept',auth,inviteControllers.acceptInvitation)

module.exports=router