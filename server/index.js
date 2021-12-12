require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const routers = require('./router/index')
const errorMiddleware = require('./middlewares/error_middleware')


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    //ukazywajem s kakim domenom my budem obmeniwatsa cookies

    //razreszaem cookies
    credentials: true,

    //ukazywajem url frontenda localhost:3000
    origin: process.env.CLIENT_URL
  }
));
app.use(errorMiddleware)

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
