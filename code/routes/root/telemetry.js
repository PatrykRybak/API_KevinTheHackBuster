const express = require('express');
const fs = require('fs');
const url = require('url');

const router = express.Router();

router.post('/', (req, res) => {
    let api_conf = JSON.parse(fs.readFileSync(__dirname + '/../../api_configuration.json'));
    if (req.body.rootKey == api_conf.rootKey) {
        
        const fileContent = fs.readFileSync(__dirname + '/../../api_telemetry.csv', 'utf-8');
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(fileContent);
    }
    else{
        return res.status(403).json({"error": "403", "message": "Access Denied"});
    }
});

module.exports = router;
