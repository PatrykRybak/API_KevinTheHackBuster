const express = require('express');
const fs = require('fs');
const url = require('url');

const router = express.Router();

router.post('/', (req, res) => {
    let api_conf = JSON.parse(fs.readFileSync(__dirname + '/../../api_configuration.json'));
    if (req.body.rootKey == api_conf.rootKey) {
        let prev = api_conf.publicKey;
        
        if (req.body.newPublicKey && typeof req.body.newPublicKey === 'string' && req.body.newPublicKey.trim() !== '') {
            api_conf.publicKey = req.body.newPublicKey;
            fs.writeFileSync(__dirname + '/../../api_configuration.json', JSON.stringify(api_conf));
            return res.status(200).json({
                "Success": "200",
                "message": "Public key updated successfully",
                "previous": prev,
                "current": api_conf.publicKey
            });
        }
        else{
            return res.status(400).json({"error": "400", "message": "Wrong .json structure"});
        }
    }
    else{
        return res.status(403).json({"error": "403", "message": "Access Denied"});
    }
});

module.exports = router;
