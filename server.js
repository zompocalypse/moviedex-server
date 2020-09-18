require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const { PORT } = require('./config');
const MOVIES_STORE = require('./movies.json');
const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(cors());
app.use(morgan(morganSetting));
app.use(helmet());

app.use(function validateBearer(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

const getSearchOptions = (req, res) => {
  let newList = MOVIES_STORE;

  const {genre, country, avg_vote} = req.query;

  if(genre){
    newList = newList.filter(movie => 
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  if(country){
    newList = newList.filter(movie => 
      movie.country.toLowerCase().includes(country.toLowerCase())
    );
  }

  if(avg_vote){
    newList = newList.filter(movie => 
      parseFloat(movie.avg_vote) >= parseFloat(avg_vote));
  }

  return res.status(200).json(newList);
};

app.get('/movie', getSearchOptions);

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }};
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

app.listen(PORT);