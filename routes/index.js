const express=require('express');
const router=express.Router()
const userRoutes=require('./api/user.routes');
const boardRoutes=require('./api/board.routes');

router.use('/user',userRoutes)
router.use('/board',boardRoutes)

router.get('/', (req, res) => {
  res.send('Welcome to the API');
});

module.exports=router