require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet= require('helmet')
const POKEDEX = require('./pokedex.json')

console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN
    console.log('validate bearer token middleware');

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
    }
    // move to the next middleware
    next()
})

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

function handleGetTypes(req, res) {
  res.json(validTypes)
}
app.get('/types', handleGetTypes);

function handleGetPokemon(req, res) {
    const {name, type} = req.query;
    let pokemonList = POKEDEX.pokemon;

    if(name) {
        pokemonList = pokemonList.filter((pokemon) => pokemon.name.toLowerCase().includes(name.toLowerCase()))
    }

    if(type) {
        pokemonList = pokemonList.filter((pokemon) => pokemon.type.includes(type))
    }


    res.send(pokemonList)
}
app.get('/pokemon', handleGetPokemon);

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})