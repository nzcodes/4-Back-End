console.log = () => {};
const rewire = require('rewire');
const expect = require('chai').expect;
const request = require('supertest');
const express = require('express');
const fs = require('fs');
const code = fs.readFileSync('app.js', 'utf8');

describe('', function() {
  it('', function(done) {
    process.env.PORT = 8000;
    const appModule = rewire('../app.js');
    const app = appModule.__get__('app');
    let animals;
    const routerModule = rewire('../animals.js');
    let singleAnimal;
    let animalToUpdate;
    const validAnimal = {name: 'testGood', emoji: 'test'};
    let createdAnimal;
    // Test that router responds to endpoints:
    const testApp = express();
    let animalsRouter;
    let validAnimalId;
    try {
      animalsRouter = routerModule.__get__('animalsRouter')
    } catch (e) {
      expect(e, 'Did you create an export an `animalsRouter` from animals.js?').to.not.exist;
    }
    testApp.use('/animals', animalsRouter);
    testApp.listen(8001, () => {
      try {
        animals = routerModule.__get__('animals');
      } catch (e) {
        expect(e, 'Did you move the `animals` array to animals.js?').to.not.exist;
      }
      request(testApp)
      .get('/animals')
      .then((response) => {
        // We have to do these checks because of the way rewire/require works and a closure over the idCounter in `utils`
        expect(response.body, 'Does your GET / route in `animalsRouter` return the `animals` array?').to.be.an.instanceOf(Array);
        expect(response.body.length, 'Did you use `seedElements` to properly seed your `animals` array? It should have 3 elements.').to.be.at.least(3);
        expect(response.body.length, 'Does your GET / route in `animalsRouter` return the `animals` array?').to.equal(animals.length);
      })
      .then(() => {
        return request(app)
        .get('/animals');
      })
      .then((response) => {
        expect(response.body, 'Does your GET / route in `animalsRouter` return the `animals` array?').to.be.an.instanceOf(Array);
        expect(response.body.length, 'Does your GET / route in `animalsRouter` return the `animals` array?').to.equal(animals.length);
        animals = response.body;
        validAnimalId = animals[0].id;
      })
      .then(() => {
        return request(app)
        .get(`/animals/${validAnimalId}`);
      })
      .then((response) => {
        expect(response.status, `Did you send a response from the GET /animals/:id route? ${validAnimalId}`).to.equal(200);
        expect(response.body, 'Did you send a single expression object instead of the whole array?').to.not.be.an.instanceOf(Array);
        const expressionToFind = animals.find((element) => {
          return element.id === Number(validAnimalId);
        });
        expect(response.body.id, 'Did you send back the correct animal by ID?').to.equal(1);
        singleAnimal = response.body;
      })
      .then(() => {
        animalToUpdate = Object.assign({}, singleAnimal, {name: 'test'});
        return request(app)
        .put('/animals/1')
        .query(animalToUpdate);
      })
      .then((response) => {
        expect(response.status, 'Did you move your PUT /animals/:id route handler to `animalsRouter` correctly?').to.equal(200);
        expect(response.body, 'Did you send back a single animal object instead of the whole array?').to.not.be.an.instanceOf(Array);
        expect(response.body, 'Did you send back the updated animal?').to.deep.equal(animalToUpdate);
        return request(app)
        .get('/animals/1')
        .then((response) => {
          expect(response.body, 'Did you still save the updated expression to the `animals` array?').to.deep.equal(animalToUpdate);
        });
      })
      .then(() => {
        return request(app)
        .post('/animals')
        .query(validAnimal)
      })
      .then((response) => {
        const lastCreated = animals[animals.length - 1];
        expect(response.body, 'Did you send back a single animal object instead of the whole array from your POST route?').to.not.be.an.instanceOf(Array);
        expect(response.status, 'Did you mount your POST /animals router correctly in `animalsRouter`?').to.not.equal(404);
        expect(response.status, 'Did you send a 201 response from the POST /animals route?').to.equal(201);
        let validPlusId = Object.assign(validAnimal, {id: response.body.id});
        expect(response.body, 'Did you send back the new animal?').to.deep.equal(validPlusId);
        createdAnimal = response.body;
        return request(app)
        .get(`/animals/${response.body.id}`)
        .then((response) => {
          expect(response.body, 'Did you save the new animal to the `animals` array?').to.deep.equal(validPlusId);
        });
      })
      .then(() => {
        return request(app)
        .delete(`/animals/${createdAnimal.id}`);
      })
      .then((response) => {
        let found = animals.find((element) => {
          return element.id === createdAnimal.id;
        });
        expect(found, 'Does your DELETE /animals/:id route delete the proper element from the `animals` array?').to.not.be.ok;
        expect(response.status, 'Did you send a 204 response from the POST /animals route?').to.equal(204);
        // Test code structure:
        const animalsRouteMatch = code.match(/\/animals/);
        expect(animalsRouteMatch.length, 'Did you remove extra /animals routes from app.js?').to.not.be.greaterThan(2);
        const appPutMatch = code.match(/app\.\s*put/);
        expect(appPutMatch, 'Did you remove extra PUT /animals routes from app.js?').not.be.okay;
        const appGetMatch = code.match(/app\.\s*get/);
        expect(appGetMatch, 'Did you remove extra /GET animals routes from app.js?').not.be.okay;
        const appPostMatch = code.match(/app\.\s*post/);
        expect(appPostMatch, 'Did you remove extra POST /animals routes from app.js?').not.be.okay;
        const appDeleteMatch = code.match(/app\.\s*delete/);
        expect(appDeleteMatch, 'Did you remove extra DELETE /animals routes from app.js?').not.be.okay;
        done();
      })
      .catch(done);
    });
  });
});
