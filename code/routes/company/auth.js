const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    getCompanyByName
} = require('../../custom_modules/dynamo');
const activityModule = require('../../custom_modules/telemetry');

const router = express.Router();

let client = JSON.parse(fs.readFileSync(__dirname + '/../../api_configuration.json'));

async function verifyHash(password, hash) {
    try {
        const match = await bcrypt.compare(password, hash);
        return match;
    } catch (err) {
        console.error(err);
        return false;
    }
}

router.post('/login', async (req, res) => {
    let companyName = req.body.login;
    let password = req.body.password;
    if (companyName && password){
        if (companyName && typeof companyName === 'string' && companyName.trim() !== '' && password && typeof password === 'string' && password.trim() !== '') {
            let user = {}
                      
            try {
                activityModule.recordActivity('login');
                user = await getCompanyByName("Companies", companyName);
            } catch (err) {
                return res.status(500).json({"error": "500", "message": "Request cannot be completed"});
            }

            if (Object.keys(user).length == 1){
                if(await verifyHash(password, user.Item.Password)){
                    const token = jwt.sign({companyName: companyName}, client.cookiePass);
                    res.cookie("KevinCookie", token, {
                        httpOnly: true,
                        maxAge: 1000 * 60 * 60 * 2
                    });
                    return res.status(200).json({"status": "200", "message": "Logged as " + companyName});
                }
                else{
                    return res.status(400).json({"error": "400", "message": "Cannot verify hash"});
                }
            }
            else{
                return res.status(400).json({"error": "400", "message": "Wrong .json structure"});
            }
        }
        else{
            return res.status(400).json({"error": "400", "message": "Wrong .json structure"});
        }
    }
    else {
        return res.status(400).json({"error": "400", "message": "Wrong .json structure"});
	}
});

router.post('/logout', async (req, res) => {
    activityModule.recordActivity('logout');
    res.cookie(client.cookieName, "", {maxAge: 0});
    return res.status(200).json({"status": "200", "message": "Logged out"});
});

module.exports = router;
