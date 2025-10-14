const Board = require('../models/boards');

function handleBoardSockets(socket, io) {
  socket.on("join_board", ({ boardId }) => {
    try {
      socket.join(boardId);
      console.log(`User ${socket.id} joined board ${boardId}`);
    } catch (err) {
      console.error("Error in join_board:", err);
      socket.emit("error_event", { message: "Failed to join board" });
    }
  });

  socket.on("draw_event", async ({ boardId, element }) => {
    try {
      await Board.findByIdAndUpdate(boardId, { $push: { content: element } });
      socket.to(boardId).emit("draw_event", { element });
    } catch (err) {
      console.error("Error in draw_event:", err);
      socket.emit("error_event", { message: "Failed to save drawing" });
    }
  });
}

module.exports = handleBoardSockets;
