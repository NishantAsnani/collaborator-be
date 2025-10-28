const board=require('../models/boards');
const {sendErrorResponse,sendSuccessResponse}=require('../utils/response');
const {STATUS_CODE}=require('../utils/constants')


async function roleCheck(req, res, next) {
  try {
    const boardId = req.params.id;
    const boardDetails = await board.findById(boardId);   

    if(boardDetails.owner.toString()==req.user.id){
         return next();
    }

    const collaborator = boardDetails.collaborators.find((collab) => collab.userId.toString() === req.user.id);

    if(!collaborator){
      return sendErrorResponse(
        res,
        {},
        "Access Denied: You are not a collaborator on this board",
        STATUS_CODE.FORBIDDEN
      );
    }

    

    else{
        if(req.method=="DELETE"){
            return sendErrorResponse(
                res,
                {},
                "Access Denied: Only the owner can delete the board",
                STATUS_CODE.FORBIDDEN
              );
        }
        else if(collaborator.role=='viewer' && req.method == 'PATCH'){
            return sendErrorResponse(
                res,
                {},
                "Access Denied: Viewers can only view the board",
                STATUS_CODE.FORBIDDEN
              );
        }
    }

    next();
  } catch (err) {
    return sendErrorResponse(
      res,
        {},
        `Error in Role Check: ${err.message}`,
        STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }




}
module.exports = roleCheck;