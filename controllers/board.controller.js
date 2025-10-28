const  Board  = require("../models/boards");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
const { STATUS_CODE } = require("../utils/constants");
const boardServices = require("../services/board.service");



async function getAllBoards(req, res) {
  try {
    const page=req.query.page? parseInt(req.query.page) : 1;
    const limit=req.query.limit? parseInt(req.query.limit) : 10;
    const userId=req.user.id;


    const allBoards = await boardServices.getAllBoards({page,limit,userId});

    
    if(allBoards) {
      return sendSuccessResponse(
      res,
      {boards:allBoards.data,pagination:allBoards.pagination},
      "Boards Retrieved Successfully",
      STATUS_CODE.OK
    );
    }
    
  } catch (err) {
    return sendErrorResponse(
      res,
      {},
      `Error Retrieving Boards: ${err.message}`,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
}

async function getBoardById(req, res) {
  try {
    const boardId = req.params.id;
    
    if(!boardId) {
      return sendErrorResponse(
        res,
        {},
        "Board ID is required",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const fetchBoard = await boardServices.fetchBoardById(boardId);

    if(!fetchBoard) {
      return sendErrorResponse(
        res,
        {},
        "Board Not Found",
        STATUS_CODE.NOT_FOUND
      );
    }

    
      return sendSuccessResponse(
        res,
        fetchBoard,
        "Board Retrieved Successfully",
        STATUS_CODE.OK
      );
    
    
  } catch (err) {
    return sendErrorResponse(
      res,
      {},
      `Error Retrieving Board: ${err.message}`,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
}


async function createBoard(req, res) {
  try {
    const { name, description, collaborators } = req.body; 
    const createBoard = await boardServices.createNewBoard({
        name,
        description:description || "",
        owner:req.user.id,
        collaborators:collaborators || []
    });

    if (createBoard) {
        return sendSuccessResponse(
        res,
        {data:createBoard},
        "Board Created Successfully",
        STATUS_CODE.CREATED
      );
    }
    } catch (err) {
        return sendErrorResponse(
        res,
        {},
        `Error Creating Board: ${err.message}`, 
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }
}


async function getAllBoardMembers(req, res) {
    try{
        const boardId = req.params.id;

        if(!boardId) {
      return sendErrorResponse(
        res,
        {},
        "Board ID is required",
        STATUS_CODE.BAD_REQUEST
      );
    }

        const boardDetails=await boardServices.fetchBoardById(boardId);

        if(!boardDetails) {
            return sendErrorResponse(
                res,
                {},
                "Board Not Found",
                STATUS_CODE.NOT_FOUND
              );
        }

        const collaborators=await boardServices.fetchAllCollaborators(boardDetails);

        console.log("collaborators",collaborators)

        return sendSuccessResponse(
            res,
            {data:collaborators},
            "Board Members Retrieved Successfully",
            STATUS_CODE.OK
        )

    }catch(err){
        return sendErrorResponse(
            res,
            {},
            `Error Retrieving Board Members: ${err.message}`,
            STATUS_CODE.INTERNAL_SERVER_ERROR
          );
    }
}

async function deleteBoard(req,res){
  try{
    const boardId=req.params.id;
    if(!boardId){
      return sendErrorResponse(
        res,
        {},
        "Board ID is required",
        STATUS_CODE.BAD_REQUEST
      );
    }
    const boardDetails=await boardServices.fetchBoardById(boardId);

    if(!boardDetails) {
        return sendErrorResponse(
            res,
            {},
            "Board Not Found",
            STATUS_CODE.NOT_FOUND
          );
    }
    if(boardDetails.owner.toString()!==req.user.id){
      return sendErrorResponse(
        res,
        {},
        "Only the owner can delete the board",
        STATUS_CODE.UNAUTHORIZED
      );
    }

    const deletedBoard=await boardServices.deleteBoard(boardId);

    if(deletedBoard){
      return sendSuccessResponse(
      res,
      {board:deletedBoard},
      "Board deleted Successfully",
      STATUS_CODE.OK
    )
    }

    
  }catch(err){
    return sendErrorResponse(
        res,
        {},
        `Error Syncing Board Element: ${err.message}`,
        STATUS_CODE.INTERNAL_SERVER_ERROR
    )
  }
}

async function editBoard(req,res){
  try{
    const boardId=req.params.id;
    const {name,description,collaborators}=req.body;
    if(!boardId){
      return sendErrorResponse(
        res,
        {},
        "Board ID is required",
        STATUS_CODE.BAD_REQUEST
      );
    }
    const boardDetails=await boardServices.fetchBoardById(boardId);

    if(!boardDetails) {
        return sendErrorResponse(
            res,
            {},
            "Board Not Found",
            STATUS_CODE.NOT_FOUND
          );
    }
    

    

    const updatedBoard=await boardServices.editBoard(boardId,{name,description,collaborators});

    return sendSuccessResponse(
      res,
      {board:updatedBoard},
      "Board Updated Successfully",
      STATUS_CODE.OK
    )
  }catch(err){
    return sendErrorResponse(
      res,
      {},
      `Error Updating Board: ${err.message}`,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    )
  }
}




module.exports={
    getAllBoards,
    getBoardById,
    createBoard,
    getAllBoardMembers,
    deleteBoard,
    editBoard
}