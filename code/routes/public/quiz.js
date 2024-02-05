const express = require('express');
const fs = require('fs');
const {
    getQuestionsfromCompany
} = require('../../custom_modules/dynamo');
const activityModule = require('../../custom_modules/telemetry');

const router = express.Router();

let api_conf = JSON.parse(fs.readFileSync(__dirname + '/../../api_configuration.json'));

router.post('/', async (req, res) => {
    if (req.body.publicKey == api_conf.publicKey) {
        let company = req.body.company;
        if(company && typeof company === 'string' && company.trim() !== ''){    
            try {
                activityModule.recordActivity('quiz');
                const questions = await getQuestionsfromCompany(company);
                return res.status(403).json({"status": "200", "questions": questions.Items});
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
