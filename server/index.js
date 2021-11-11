require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const routers = require('./router/index')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api', routers);

const start = async() =>{
    try{
      await mongoose.connect(process.env.DB_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true
      });
      app.listen(PORT, () => {
          console.log(`Server start on port ${5000}`)
      })
    }catch(e){
        console.log(e)
    }
};

start();
