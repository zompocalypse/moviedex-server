require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const MOVIES_STORE = require('./movies.json');
const app = express()

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

const getSearchOptions = (req, res) => {
  let newList = MOVIES_STORE;

  const {genre, country, avg_vote} = req.query;

  if(genre){
    newList = newList.filter(movie => 
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    )
  }

  if(country){
    newList = newList.filter(movie => 
      movie.country.toLowerCase().includes(country.toLowerCase())
    )
  }

  if(avg_vote){
    newList = newList.filter(movie => 
      parseFloat(movie.avg_vote) >= parseFloat(avg_vote))
  }
  console.log(`<p>${newList.length}  ${MOVIES_STORE.length}</p>`);

  return res.status(200).json(newList)
} 

app.get('/movie', getSearchOptions);

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})