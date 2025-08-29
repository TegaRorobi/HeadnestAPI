const app = require("./app");
require("dotenv").config();
require('./worker')

const PORT = process.env.PORT;

app.listen(process.env.PORT, () => {
    console.log(`Sever is listening on http://localhost:${PORT}`)
})