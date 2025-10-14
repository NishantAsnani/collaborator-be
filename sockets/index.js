const { STATUS_CODE } = require('../utils/constants');
const { sendErrorResponse } = require('../utils/response');
const handleBoardSockets = require('./boards.socket');



function handleSockets(socket, io) {
    try {
        handleBoardSockets(socket, io);

        socket.on("disconnect", () => {
            console.log(`🔴 User disconnected: ${socket.id}`);
        });
    } catch (err) {
        sendErrorResponse(socket,`${err.message}`,STATUS_CODE.SERVER_ERROR);
    }

}

module.exports = handleSockets