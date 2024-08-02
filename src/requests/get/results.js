const fs = require("fs");
const func = require("../../static/func");
const url = require("url");

module.exports = {
  init: (prefix, website) => {
    website.get(`${prefix}results`, (request, response) => {
      func.debugOverride(request);
      if (!request.session.forms || !request.session.forms.authenticated) {
        response.sendFile(`${__dirname.slice(0, -13)}/static/login.html`);
      } else {
        func.connectToMySQL(response, (err, db) => {
          if (err) throw err;
          const query = url.parse(request.url, true).query;
          const forms = fs
            .readdirSync(`${__dirname.slice(0, -16)}forms`)
            .filter((form) => form.endsWith(".html"));
          if (query.form && forms.includes(query.form + ".html")) {
            const form = query.form;
            db.query(
              `SELECT * FROM forms.submissions WHERE FormName = '${form}'`,
              (err, results, fields) => {
                if (err) {
                  response.send(func.sendError(err));
                  return;
                }
                let header = [];
                let data = [];
                for (i in JSON.parse(results[0].SubmissionData)) {
                  header.push(i);
                }
                for (row in results) {
                  let i = [];
                  for (column in results[row]) {
                    if (column == "SubmissionData") {
                      let submissiondata = JSON.parse(results[row][column]);
                      for (subRow in submissiondata) {
                        i.push(submissiondata[subRow]);
                      }
                    }
                  }
                  data.push(i);
                }
                response.render(
                  `${__dirname.slice(0, -13)}/static/results.html`,
                  {
                    formName: form,
                    header: JSON.stringify(header),
                    data: JSON.stringify(data),
                  }
                );
              }
            );
          } else {
            response.sendStatus(404);
          }
        });
      }
    });
  },
};
