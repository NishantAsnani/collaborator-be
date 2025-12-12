const invite = require('../models/invites')
const board = require('../models/boards')
const User=require('../models/users');
const { sendErrorResponse, sendSuccessResponse } = require('../utils/response')
const { STATUS_CODE } = require("../utils/constants");
const inviteServices = require('../services/invite.service')
const crypto = require('crypto');


async function createInvite(req, res) {
    try {
        const { boardId, email = null, boardRole = "viewer" } = req.body;
        let checkValidInviterId;
        const userId = req.user.id;
        const token = crypto.randomBytes(32).toString('hex');

        if (!boardId) {
            return sendErrorResponse(
                res,
                {},
                `BoardId required for creating invite`,
                STATUS_CODE.BAD_REQUEST
            )
        }

        const Board = await board.findById(boardId);

        if (!Board) {
            return sendErrorResponse(
                res,
                {},
                `Board Not found`,
                STATUS_CODE.NOT_FOUND
            )
        }

        checkValidInviterId = Board.owner.toString() === userId || Board.collaborators?.some(c => c.userId.toString() === userId);

        if (!checkValidInviterId) {
            return sendErrorResponse(
                res,
                {},
                `Only owner or collaborators of board can send board invites`,
                STATUS_CODE.BAD_REQUEST
            )
        }

        const newInvite = await inviteServices.createNewInvite({
            boardId,
            email,
            boardRole,
            invitedBy: req.user.id,
            token
        })

        const inviteLink = `${process.env.CLIENT_URL}/invite/${token}`

        return sendSuccessResponse(
            res,
            inviteLink,
            `Invite Created Sucessfully`,
            STATUS_CODE.CREATED
        )

    } catch (err) {
        return sendErrorResponse(
            res,
            {},
            `Error creating invite ${err}`,
            STATUS_CODE.SERVER_ERROR
        )
    }
}

async function checkTokenInvite(req, res) {
    try {
        const token = req.params.token;
        const userId = req?.user?.id;
        const userEmail = req?.user?.email;
        let userStatus = 'not_signed_up';
        let emailMismatch = false;
        let alreadyMember= false;

        if (!token) {
            return sendErrorResponse(
                res,
                {},
                `Token not found`,
                STATUS_CODE.BAD_REQUEST
            )
        }
        const tokenInvite = await invite.findOne({ token });

        if (!tokenInvite || tokenInvite.expiresAt < new Date()) {
            return sendErrorResponse(
                res,
                {},
                `Invalid or expired invite`,
                STATUS_CODE.BAD_REQUEST
            )
        }

        const Board = await board.findById(tokenInvite.boardId);
        
        if (!Board) {
            return sendErrorResponse(
                res,
                {},
                `Board not found`,
                STATUS_CODE.NOT_FOUND
            )
        }

        if (userId) {
            userStatus = 'logged_in';

            alreadyMember = Board.collaborators.some(c => c.userId.toString() === userId) || Board.owner.toString()==userId;

            if (tokenInvite.email) {
                emailMismatch = tokenInvite.email != userEmail
            }
        } else if (tokenInvite.email) {
            const existingUser = await User.findOne({
                email: tokenInvite.email.toLowerCase()
            });

            if (existingUser) {
                userStatus = 'not_logged_in';  
            }
        }

        let responseObject={
            boardId:Board.id,
            boardName:Board.name,
            boardDescription:Board.description,
            alreadyMember,
            userStatus,
            emailMismatch,
            role:tokenInvite.boardRole,
            email:userEmail
        }

        return sendSuccessResponse(
            res,
            responseObject,
            `Invite Validated Sucessfully`,
            STATUS_CODE.SUCCESS
        )

    } catch (err) {
        return sendErrorResponse(
            res,
            {},
            `Error Validating invite ${err.msg}`,
            STATUS_CODE.SERVER_ERROR
        )
    }
}

async function acceptInvitation(req,res){
    try{
        const {token}=req.body;
        const userId=req.user.id;
        if (!token) {
            return sendErrorResponse(
                res,
                {},
                `Token not found`,
                STATUS_CODE.BAD_REQUEST
            )
        }
        const tokenInvite = await invite.findOne({ token });

        if (!tokenInvite || tokenInvite.expiresAt < new Date()) {
            return sendErrorResponse(
                res,
                {},
                `Invalid or expired invite`,
                STATUS_CODE.BAD_REQUEST
            )
        }

        const Board = await board.findById(tokenInvite.boardId);
        
        
        
        if (!Board) {
            return sendErrorResponse(
                res,
                {},
                `Board not found`,
                STATUS_CODE.NOT_FOUND
            )
        }
        
        const user=await User.findById(userId)
        const emailMismatch = tokenInvite.email && tokenInvite.email != user.email

        if(emailMismatch){
            return sendErrorResponse(
                res,
                {},
                `Cannot access invitation of another user`,
                STATUS_CODE.FORBIDDEN
            )
        }

        const acceptInvite= await inviteServices.acceptNewInvite({tokenInvite,Board,user});

        return sendSuccessResponse(
            res,
            acceptInvite,
            `Invite Accepted Sucessfully`,
            STATUS_CODE.SUCCESS
        )
    }catch(err){
        return sendErrorResponse(
            res,
            {},
            `Error Accepting Invite ${err}`,
            STATUS_CODE.SERVER_ERROR
        )
    }
}

module.exports = {
    createInvite,
    checkTokenInvite,
    acceptInvitation
}