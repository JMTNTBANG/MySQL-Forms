const fs = require("fs")
const url = require("url")

module.exports = {
    init: (prefix, website) => {
        website.get(prefix, (request, response) => {
            const query = url.parse(request.url, true).query
            const forms = fs.readdirSync(`${__dirname.slice(0, -16)}forms`).filter(form => form.endsWith(".html"))
            if (query.form && forms.includes(query.form + ".html")) {
                response.sendFile(`${__dirname.slice(0, -16)}forms/${forms.filter(form => form == `${query.form}.html`)[0]}`)
            } else {
                response.sendStatus(404)
            }
        })
    }}