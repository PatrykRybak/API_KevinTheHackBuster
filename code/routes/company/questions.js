const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const {
    getAllQuestions,
    addOrUpdate,
    deleteQuestionByQID
} = require('../../custom_modules/dynamo');
const activityModule = require('../../custom_modules/telemetry');

const router = express.Router();

let api_conf = JSON.parse(fs.readFileSync(__dirname + '/../../api_configuration.json'));

function checkStructure(arr) {
    if (!Array.isArray(arr)) {
        return false;
    }
    for (let i = 0; i < arr.length; i++) {
        if (!Array.isArray(arr[i]) || arr[i].length !== 2 || typeof arr[i][0] !== 'string' || typeof arr[i][1] !== 'boolean') {
            return false;
        }
    }
    return true;
}

router.post('/', async (req, res) => {
    const cookie = req.cookies[api_conf.cookieName];
    if (cookie) {
        const claims = jwt.verify(cookie, api_conf.cookiePass);
        if (!claims) {
            return res.status(403).json({"error": "403", "message": "Access Denied"});
        }
        
        try {
            activityModule.recordActivity('questions');
            const questions = await getAllQuestions(claims.companyName);
            return res.status(200).json({"status": "200", "questions": questions.Items});
        } catch (err) {
            console.error(err);
            return res.status(500).json({"error": "500", "message": "Request cannot be completed"});
        }

    }
    else{
        return res.status(403).json({"error": "403", "message": "Access Denied"});
    }
});

router.post('/add', async (req, res) => {
    const cookie = req.cookies[api_conf.cookieName];
    if (cookie) {
        const claims = jwt.verify(cookie, api_conf.cookiePass);
        if (!claims) {
            return res.status(403).json({"error": "403", "message": "Access Denied"});
        }
        else{
            let category = req.body.category;
            let body = req.body.body;
            let options = req.body.options;
            let inUse = req.body.inUse;
            if(category && typeof category === 'string' && category.trim() !== '' && body && typeof body === 'string' && body.trim() !== '' && options && checkStructure(options) && typeof inUse === 'boolean'){
                let tmp = {}
                tmp["QID"] = uuidv4();
                tmp["Company"] = claims.companyName;
                tmp["Category"] = category;
                tmp["Body"] = body;
                tmp["Options"] = options;
                tmp["InUse"] = inUse;
                
                try {
                    activityModule.recordActivity('addQuestion');
                    const response = await addOrUpdate("Questions", tmp);
                    return res.status(200).json({"status": "200", "message": "Question added"});
                } catch (err) {
                    console.error(err);
                    return res.status(500).json({"error": "500", "message": "Request cannot be completed"});
                }
            }
            else{
                return res.status(400).json({"error": "400", "message": "Wrong .json structure"});
            }
        }
    }
    else{
        return res.status(403).json({"error": "403", "message": "Access Denied"});
    }
});

router.post('/delete', async (req, res) => {
    const cookie = req.cookies[api_conf.cookieName];
    if (cookie) {
        const claims = jwt.verify(cookie, api_conf.cookiePass);
        if (!claims) {
            return res.status(403).json({"error": "403", "message": "Access Denied"});
        }
        else{
            let qid = req.body.qid;
            if (qid && typeof qid === 'string' && qid.trim() !== '') {

                let questionToDelete = {};
                questionToDelete["QID"] = qid;
    
                try {
                    activityModule.recordActivity('deleteQuestion');
                    const response = await deleteQuestionByQID(questionToDelete);
                    return res.status(200).json({"status": "200", "message": "Question deleted"});
                } catch (err) {
                    console.error(err);
                    return res.status(500).json({"error": "500", "message": "Request cannot be completed"});
                }
            }
            else{
                return res.status(400).json({"error": "400", "message": "Wrong .json structure"});
            }  
        }
    }
    else{
        return res.status(403).json({"error": "403", "message": "Access Denied"});
    }
});


router.post('/edit', async (req, res) => {
    const cookie = req.cookies[api_conf.cookieName];
    if (cookie) {
        const claims = jwt.verify(cookie, api_conf.cookiePass);
        if (!claims) {
            return res.status(403).json({"error": "403", "message": "Access Denied"});
        }
        else{
            let qid = req.body.qid;
            let category = req.body.category;
            let body = req.body.body;
            let options = req.body.options;
            let inUse = req.body.inUse;
            if(qid && typeof qid === 'string' && category && typeof category === 'string' && category.trim() !== '' && body && typeof body === 'string' && body.trim() !== '' && options && checkStructure(options) && typeof inUse === 'boolean'){
                let tmp = {}
                tmp["QID"] = qid;
                tmp["Company"] = claims.companyName;
                tmp["Category"] = category;
                tmp["Body"] = body;
                tmp["Options"] = options;
                tmp["InUse"] = inUse;
                
                try {
                    activityModule.recordActivity('editQuestion');
                    const response = await addOrUpdate("Questions", tmp);
                    return res.status(200).json({"status": "200", "message": "Question updated"});
                } catch (err) {
                    console.error(err);
                    return res.status(500).json({"error": "500", "message": "Request cannot be completed"});
                }
            }
            else{
                return res.status(400).json({"error": "400", "message": "Wrong .json structure"});
            }
        }
    }
    else{
        return res.status(403).json({"error": "403", "message": "Access Denied"});
    }
});

module.exports = router;
