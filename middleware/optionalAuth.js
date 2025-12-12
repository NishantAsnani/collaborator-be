const {sendSuccessResponse,sendErrorResponse} = require("../utils/response");
const {STATUS_CODE}=require('../utils/constants')
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

async function optionalAuth(req, res, next) {
  try {
    if (!req.headers.authorization) {
        return next();
    }
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return sendErrorResponse(res,"Token not found",{},STATUS_CODE.UNAUTHORIZED)
    }

    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return sendErrorResponse(res,`Unknown error ${error}`,{},STATUS_CODE.UNAUTHORIZED)
  }
}


module.exports = optionalAuth;