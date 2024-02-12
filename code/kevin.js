const express = require('express');
const url = require('url');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');

// ROOT
const setApiPublicKey = require('./routes/root/setApiPublicKey');
const addCompany = require('./routes/root/addCompany');
const delCompany = require('./routes/root/delCompany');
const rootTelemetry = require('./routes/root/telemetry');

// COMPANY
const auth = require('./routes/company/auth');
const questions = require('./routes/company/questions');
const newPassword = require('./routes/company/newPassword');
const telemetry = require('./routes/company/telemetry');

// PUBLIC
const quiz = require('./routes/public/quiz');
const answer = require('./routes/public/answer');
const question = require('./routes/public/question');

const app = express();

let api_conf = JSON.parse(fs.readFileSync(__dirname + '/api_configuration.json'));

app.disable('x-powered-by');
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: api_conf.cors
}));

app.listen(api_conf.port, api_conf.ip, () => {
    console.log(`Kevin The Hack Buster API v1.0 works @ http://${api_conf.ip}:${api_conf.port}/api`);
});

//Main API welcome page
app.get('/api', (req, res) => {
    res.send('Kevin the Hack Buster - API');
});

//Handling invalid requests
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({"error": "400", "message": "Invalid .json"});
    }
    next();
});

// ROUTES
app.use('/api/root/setApiPublicKey', setApiPublicKey);
app.use('/api/root/addCompany', addCompany);
app.use('/api/root/delCompany', delCompany);
app.use('/api/root/telemetry', rootTelemetry);
app.use('/api/company/auth', auth);
app.use('/api/company/questions', questions);
app.use('/api/company/newPassword', newPassword);
app.use('/api/company/telemetry', telemetry);
app.use('/api/quiz', quiz);
app.use('/api/answer', answer);
app.use('/api/question', question);

// 404 error page
app.use((req, res) => {
    res.status(404).json({"error": "404", "message": "Not found"});
});
