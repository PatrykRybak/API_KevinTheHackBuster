const express = require('express');
const fs = require('fs');
const {
    newTelemetryRecord
} = require('../../custom_modules/dynamo');
const activityModule = require('../../custom_modules/telemetry');

const router = express.Router();

let api_conf = JSON.parse(fs.readFileSync(__dirname + '/../../api_configuration.json'));

function isArrayWithBooleans(param) {
    if (!Array.isArray(param)) {
        return false;
    }
    for (let i = 0; i < param.length; i++) {
        if (typeof param[i] !== 'boolean') {
            return false;
        }
    }
    return true;
}

router.post('/', async (req, res) => {
    if (req.body.publicKey == api_conf.publicKey) {
        let qid = req.body.qid;
        let company = req.body.company;
        let platform = req.body.platform;
        let options = req.body.options;
        if(qid && typeof qid === 'string' && qid.trim() !== '' && company && typeof company === 'string' && company.trim() !== '' && platform && typeof platform === 'string' && platform.trim() !== '' && options && isArrayWithBooleans(options)){   
            let tmp = {}
            tmp["Company"] = company;
            tmp["Date"] = new Date().toJSON();
            tmp["Platform"] = platform;
            tmp["QID"] = qid;
            tmp["Options"] = options;
            
            try {
                activityModule.recordActivity('answer');
                const response = await newTelemetryRecord(tmp);
                return res.status(200).json({"status": "200", "message": "Answer submited"});
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
