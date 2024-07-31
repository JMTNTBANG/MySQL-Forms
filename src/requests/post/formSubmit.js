const func = require("../../static/func.js");
const config = require("../../config.json");
const url = require("url");

module.exports = {
  init: (prefix, website) => {
    website.post(`${prefix}formSubmit`, (request, response) => {
      const formData = request.body;
      const formName = url.parse(request.headers.referer, true).query.form;
      func.connectToMySQL(response, (err, db) => {
        if (err) throw err;
        const ip = request.ip.slice(7)
        db.query(
          `INSERT INTO \`forms\`.\`submissions\` (\`FormName\`, \`SubmitterIP\`, \`SubmissionData\`) VALUES ('${formName}', '${
            ip
          }', '${JSON.stringify(formData)}')`,
          (err, results, fields) => {
            if (err) response.send(func.sendError(err));
            else {
              response.send(
                `<script>alert("Form Successfully Submitted"); window.location = 'https://jmtntbang.com';</script>`
              );
            }
          }
        );
      });
    });
  },
};

// INSERT INTO `forms`.`submissions` (`FormName`, `SubmitterIP`, `SubmissionData`) VALUES ('`${formName}`', '`${request.ip}`', '');

// CREATE TABLE `forms`.`submissions` (
//   `ID` INT NOT NULL AUTO_INCREMENT,
//   `FormName` VARCHAR(255) NOT NULL,
//   `SubmitterIP` VARCHAR(15) NOT NULL,
//   `SubmissionData` JSON NOT NULL,
//   `DateSubmitted` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (`ID`),
//   UNIQUE INDEX `ID_UNIQUE` (`ID` ASC) VISIBLE);
