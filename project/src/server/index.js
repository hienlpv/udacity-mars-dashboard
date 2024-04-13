require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')
var cors = require('cors')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use('/', express.static(path.join(__dirname, '../public')))

app.get('/rover/:rover', async (req, res) => {
    try {
        let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.rover}/photos?sol=10&api_key=${process.env.API_KEY}`
        let { photos } = await fetch(url).then(res => res.json())
        res.send({ photos, roverInfo: photos[0].rover })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))