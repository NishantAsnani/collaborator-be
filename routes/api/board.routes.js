const express=require('express');
const router=express.Router()
const boardControllers=require('../../controllers/board.controller')
const auth=require('../../middleware/auth')


router.get('/',auth,boardControllers.getAllBoards)

router.get('/:id',auth,boardControllers.getBoardById)

router.get('/:id/collaborators',auth,boardControllers.getAllBoardMembers)

router.post('/',auth,boardControllers.createBoard)

router.patch('/:id',auth,boardControllers.editBoard)

router.delete('/:id',auth,boardControllers.deleteBoard)    



module.exports=router
