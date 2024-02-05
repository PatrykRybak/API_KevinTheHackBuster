const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const {
    readTelemetryRecord
} = require('../../custom_modules/dynamo');
const activityModule = require('../../custom_modules/telemetry');

const router = express.Router();

let api_conf = JSON.parse(fs.readFileSync(__dirname + '/../../api_configuration.json'));

router.post('/', async (req, res) => {
    const cookie = req.cookies[api_conf.cookieName];
    if (cookie) {
        const claims = jwt.verify(cookie, api_conf.cookiePass);
        if (!claims) {
            return res.status(403).json({"error": "403", "message": "Access Denied"});
        }
        else{
            try {
                activityModule.recordActivity('telemetry');
                const data = await readTelemetryRecord(claims.companyName);
                return res.status(200).json({"status": "200", "telemetry": data.Items});
            } catch (err) {
                return res.status(500).json({"error": "500", "message": "Request cannot be completed"});
            }
        }
    }
    else{
        return res.status(403).json({"error": "403", "message": "Access Denied"});
    }
});

module.exports = router;
