const express = require('express')
const router = express.Router();

router.post('/', (req, res)=>{
    console.log(req.body);
    res.status(200).send("Will be available sortly");
})

module.exports = router;