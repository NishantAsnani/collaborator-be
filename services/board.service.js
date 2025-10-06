const Board = require("../models/boards");
const User=require("../models/users");

async function getAllBoards(queryParams){
    try{
    const { page, limit} = queryParams;
    let whereClause={}
    const offset = (page - 1) * limit; // Calculate offset for pagination

    const allBoards=await Board.find().skip(offset).limit(limit);
    const totalBoards = await Board.countDocuments(whereClause);
    const totalPages = Math.ceil(totalBoards / limit);

    return {
      data: allBoards,
      pagination: {
        totalBoards,
        totalPages,
        currentPage: page,
        limit
      }
    };
  }catch(err){
    throw new Error(err);
  }
}

async function fetchBoardById(userId) {
  try {
    const board = await Board.findById(userId);
    
    return board;
  } catch (err) {
    throw new Error(err);
  }
}


async function createNewBoard(boardData) {
    try {
        const { name, description, owner, collaborators } = boardData;
        const newBoard = await Board.create({
            name,
            description,
            owner,
            collaborators
        });
        return newBoard
    } catch (err) {
        throw new Error(err);
    }
}

async function fetchAllCollaborators(board){
    try{
        const collaboratorsDetails = await User.find({
            _id:{
                $in:board.collaborators
            },   
        }
    ).select('name')


        return collaboratorsDetails
    }catch(err){
        throw new Error(err);
    }
}


module.exports={
    getAllBoards,
    fetchBoardById,
    createNewBoard,
    fetchAllCollaborators
}