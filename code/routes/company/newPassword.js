const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    addOrUpdate
} = require('../../custom_modules/dynamo');
const activityModule = require('../../custom_modules/telemetry');

const router = express.Router();

let api_conf = JSON.parse(fs.readFileSync(__dirname + '/../../api_configuration.json'));

async function hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

router.post('/', async (req, res) => {
    const cookie = req.cookies[api_conf.cookieName];
    if (cookie) {
        const claims = jwt.verify(cookie, api_conf.cookiePass);
        if (!claims) {
            return res.status(403).json({"error": "403", "message": "Access Denied"});
        }
        else{
            let newPassword = req.body.password;
            if(newPassword && typeof newPassword === 'string' && newPassword.trim() !== ''){  

                let tmp = {}
                tmp["Name"] = claims.companyName;
                tmp["Password"] = await hashPassword(newPassword);

                try {
                    activityModule.recordActivity('newPassword');
                    const questions = await addOrUpdate("Companies", tmp);
                    return res.status(200).json({"status": "200", "message": "Password changed"});
                    
                } catch (err) {
                    return res.status(500).json({"error": "500", "message": "Request cannot be completed"});
                }
            }
            else{
                return res.status(403).json({"error": "400", "message": "Wrong .json structure"});
            }
        }
    }
    else{
        return res.status(403).json({"error": "403", "message": "Access Denied"});
    }
});

module.exports = router;
