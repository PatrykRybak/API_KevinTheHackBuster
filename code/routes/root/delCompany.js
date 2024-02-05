const express = require('express');
const fs = require('fs');
const {
    del
} = require('../../custom_modules/dynamo');
const activityModule = require('../../custom_modules/telemetry');

const router = express.Router();

router.post('/', async (req, res) => {
    let api_conf = JSON.parse(fs.readFileSync(__dirname + '/../../api_configuration.json'));
    if (req.body.rootKey == api_conf.rootKey) {        
        if (req.body.companyName && typeof req.body.companyName === 'string' && req.body.companyName.trim() !== '') {

            let company = {};
            company["Name"] = req.body.companyName;

            try {
                activityModule.recordActivity('delCompany');
                const response = await del("Companies", company);
                return res.status(200).json({"status": "200", "message": "Company deleted"});
            } catch (err) {
                console.error(err);
                return res.status(500).json({"error": "500", "message": "Request cannot be completed"});
            }
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
