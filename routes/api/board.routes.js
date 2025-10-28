const express=require('express');
const router=express.Router()
const boardControllers=require('../../controllers/board.controller')
const auth=require('../../middleware/auth')
const roleCheck=require('../../middleware/role-check')

router.get('/',auth,boardControllers.getAllBoards)

router.get('/:id',auth,roleCheck,boardControllers.getBoardById)

router.get('/:id/collaborators',auth,boardControllers.getAllBoardMembers)

router.post('/',auth,boardControllers.createBoard)

router.patch('/:id',auth,roleCheck,boardControllers.editBoard)

router.delete('/:id',auth,roleCheck,boardControllers.deleteBoard)    



module.exports=router
