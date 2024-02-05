const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const {
    addOrUpdate
} = require('../../custom_modules/dynamo');
const activityModule = require('../../custom_modules/telemetry');

const router = express.Router();

async function hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

router.post('/', async (req, res) => {
    let api_conf = JSON.parse(fs.readFileSync(__dirname + '/../../api_configuration.json'));
    if (req.body.rootKey == api_conf.rootKey) {        
        if (req.body.companyName && typeof req.body.companyName === 'string' && req.body.companyName.trim() !== '' && req.body.password && typeof req.body.password === 'string' && req.body.password.trim() !== '') {
            
            let company = {};
            company["Name"] = req.body.companyName;
            company["Password"] = await hashPassword(req.body.password);

            try {
                activityModule.recordActivity('addCompany');
                const response = await addOrUpdate("Companies", company);
                return res.status(200).json({"status": "200", "message": "Company added"});
            } catch (err) {
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
