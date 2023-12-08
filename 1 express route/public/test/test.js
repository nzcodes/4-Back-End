const express = require('express');
const app = express();

// Serves Express Yourself website
app.use(express.static('public'));

const { getElementById, getIndexById, updateElement,
        seedElements, createElement } = require('./utils');

const expressions = [];
seedElements(expressions, 'expressions');
const animals = [];
seedElements(animals, 'animals');

const PORT = process.env.PORT || 4001;

app.get('/animals', (req, res, next) => {
  res.send(animals);
});


app.get('/animals/:id', (req, res, next) => {
  const foundAnimal = getElementById(req.params.id, animals);

  if (!foundAnimal) {
    // Send a 404 (Not Found) status when the animal is not found
    res.status(404).send('Animal not found');
  } else {
    res.send(foundAnimal);
  }
});
app.put('/animals/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const animalIndex = getIndexById(id, animals);

  if (animalIndex === -1) {
    // Send a 404 (Not Found) status when the animal is not found
    res.status(404).send('Animal not found');
  } else {
    // Use the updateElement() helper function to update the animal
    const updatedAnimal = updateElement(id, req.query, animals);
    
    // Send the updated animal as the response
    res.send(updatedAnimal);
  }
});

app.post('/animals', (req, res, next) => {
  const newAnimal = createElement('animals', req.query);

  if (newAnimal) {
    // Add the new animal to the animals array
    animals.push(newAnimal);
    // Send the new animal as the response
    res.status(201).send(newAnimal);
  } else {
    // Send a 400 (Bad Request) status code if the object is not valid
    res.status(400).send('Invalid animal data');
  }
});

app.delete('/animals/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const animalIndex = getIndexById(id, animals);

  if (animalIndex === -1) {
    // Send a 404 (Not Found) status when the animal is not found
    res.status(404).send('Animal not found');
  } else {
    // Delete the animal from the array
    animals.splice(animalIndex, 1);
    // Send a 204 (No Content) status code for successful deletion
    res.status(204).send();
  }
});

app.get('/expressions', (req, res, next) => {
  res.send(expressions);
});

app.get('/expressions/:id', (req, res, next) => {
  const foundExpression = getElementById(req.params.id, expressions);
  if (foundExpression) {
    res.send(foundExpression);
  } else {
    res.status(404).send();
  }
});

app.put('/expressions/:id', (req, res, next) => {
  const expressionIndex = getIndexById(req.params.id, expressions);
  if (expressionIndex !== -1) {
    updateElement(req.params.id, req.query, expressions);
    res.send(expressions[expressionIndex]);
  } else {
    res.status(404).send();
  }
});

app.post('/expressions', (req, res, next) => {
  const receivedExpression = createElement('expressions', req.query);
  if (receivedExpression) {
    expressions.push(receivedExpression);
    res.status(201).send(receivedExpression);
  } else {
    res.status(400).send();
  }
});

app.delete('/expressions/:id', (req, res, next) => {
  const expressionIndex = getIndexById(req.params.id, expressions);
  if (expressionIndex !== -1) {
    expressions.splice(expressionIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`); 
});
