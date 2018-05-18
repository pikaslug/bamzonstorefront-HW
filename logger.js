const fs = require('fs');
const moment = require('moment');


const logger = {

  writeToLog: function(type, msg) {
    let types = ['INFO', 'DEBUG', 'WARN', 'ERROR'];

    if (types.includes(type.toUpperCase())) {
      type = "[" + type.toUpperCase() + "]";
      let now = moment().utc().format("YYYY-MM-DD HH:mm:ss");
      let row = `${now} GMT - ${type} ${msg}\n`;

      fs.appendFile('log.txt', row, 'utf8', function(err) {
        if (err) throw err;
      })
    } else {
      writeToLog('error', "Message type not supported!");
    }
  }

}


module.exports = logger
