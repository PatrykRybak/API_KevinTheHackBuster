const fs = require('fs');
const path = require('path');

module.exports.recordActivity = async function(activity) {
    const date = new Date();
    const dateString = date.toISOString();
    const data = `${dateString}, ${activity}\n`;

    fs.appendFile(path.join(__dirname, '../api_telemetry.csv'), data, 'utf8', (err) => {
        if (err) throw err;
    });
};
