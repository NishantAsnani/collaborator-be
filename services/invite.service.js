const invite = require("../models/invites");
const User = require("../models/users");


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


module.exports = {
    createNewInvite
}