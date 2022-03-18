const express = require("express")

const cors = require("cors")
const helmet = require("helmet")
const compress = require("compression")
const { error } = require("./mddleware/errorHandling")

const booking = require("./router/coach")


const app = express()

app.use(cors())
app.use(helmet())
app.use(compress())

app.use(express.json())

app.use("/api/v1/", booking)

app.use(error)

const port = process.env.PORT || 3001

app.listen(port, err => {
    if (err) 
        throw err
    console.log(`Port is running at :${port}`);
})