const invite=require('../models/invites')
const board=require('../models/boards')
const { sendErrorResponse, sendSuccessResponse } = require('../utils/response')
const { STATUS_CODE } = require("../utils/constants");
const inviteServices=require('../services/invite.service')
const crypto=require('crypto');

async function createInvite(req,res){
    try{
        const {boardId,email=null,boardRole="viewer"}=req.body;
        let checkValidInviterId;
        const userId=req.user.id;
        const token=crypto.randomBytes(32).toString('hex');

        if(!boardId){
            return sendErrorResponse(
                res,
                {},
                `BoardId required for creating invite`,
                STATUS_CODE.BAD_REQUEST
            )
        }

        const Board= await board.findById(boardId);

        if(!Board){
            return sendErrorResponse(
                res,
                {},
                `Board Not found`,
                STATUS_CODE.NOT_FOUND
            )
        }

        checkValidInviterId = Board.owner.toString() === userId || Board.collaborators?.some(c => c.userId.toString() === userId);

        if(!checkValidInviterId){
            return sendErrorResponse(
                res,
                {},
                `Only owner or collaborators of board can send board invites`,
                STATUS_CODE.BAD_REQUEST
            )
        }

        const newInvite=await inviteServices.createNewInvite({
            boardId,
            email,
            boardRole,
            invitedBy:req.user.id,
            token
        })

        const inviteLink=`${process.env.CLIENT_URL}/invite/${token}`

        return sendSuccessResponse(
            res,
            inviteLink,
            `Invite Created Sucessfully`,
            STATUS_CODE.CREATED
        )

    }catch(err){
        return sendErrorResponse(
            res,
            {},
            `Error creating invite ${err}`,
            STATUS_CODE.SERVER_ERROR
        )
    }
}


module.exports={
    createInvite
}