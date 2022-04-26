const app = require('express')();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());
require('dotenv/config');

const episode = require('./routes/episode');
app.use('/episodes',episode);

const podcast = require('./routes/podcast');
app.use('/podcasts',podcast);

app.get('/',(req,res) =>{
    res.send('API for podcast 👉 localhost:3000/podcasts');
});

mongoose.connect(process.env.DB,() => {
    console.log('Connected to DB');
});

app.listen(3000);