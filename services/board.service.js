const Board = require("../models/boards");
const User = require("../models/users");

async function getAllBoards(queryParams) {
  try {
    const { page, limit, userId } = queryParams;
    let whereClause = {
      $or: [
        { owner: userId },
        {
          collaborators: {
            $in: [userId]
          },
        }
      ]
    }

    const offset = (page - 1) * limit; // Calculate offset for pagination

    const allBoards = await Board.find(whereClause).skip(offset).limit(limit);


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
  } catch (err) {
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

async function fetchAllCollaborators(board) {
  try {
    const collaboratorsDetails = await User.find({
      _id: {
        $in: board.collaborators
      },
    }
    ).select('name')


    return collaboratorsDetails
  } catch (err) {
    throw new Error(err);
  }
}

async function editBoard(boardId, editParams) {
  try{
    const {name,description,collaborators}=editParams;
    const updatedData={};
        if(name) updatedData.name=name;
        if(description) updatedData.description=description;
        if(collaborators) updatedData.collaborators=collaborators;
        const updatedBoard=await Board.findByIdAndUpdate(boardId,updatedData,{new:true});
        
        return updatedBoard;

  }catch(err){
    throw new Error(err);
  }
}

async function deleteBoard(boardId) {
  try{
    const deletedBoard=await Board.findByIdAndDelete(boardId);
    return deletedBoard;
  }catch(err){
    throw new Error(err);
  }
}

module.exports = {
  getAllBoards,
  fetchBoardById,
  createNewBoard,
  fetchAllCollaborators,
  editBoard,
  deleteBoard
}