const invite = require("../models/invites");



async function createNewInvite( inviteParams ) {
    try {
        const { boardId, email, boardRole,invitedBy,token } = inviteParams
        const expiresAt=(Date.now()+ 1000*60*60*24) //1 Day Expire time
        const newInvite=await invite.create({
            token,
            email,
            expiresAt,
            boardId,
            boardRole,
            invitedBy
        })

        return newInvite
    } catch (err) {
        throw new Error(err);
    }
}

async function acceptNewInvite(inviteParams){
    try{
        const {tokenInvite,Board,user}=inviteParams;

        Board.collaborators.push({
            userId:user.id,
            role:tokenInvite.boardRole
        })

        await Board.save();
    }catch(err){
        throw new Error(err)
    }
}


module.exports = {
    createNewInvite,
    acceptNewInvite
}