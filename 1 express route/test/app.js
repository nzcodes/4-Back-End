console.log = () => {};
const rewire = require('rewire');
const expect = require('chai').expect;
const request = require('supertest');

describe('', function() {
  it('', function(done) {
    process.env.PORT = 8000;
    const appModule = rewire('../app.js');
    const app = appModule.__get__('app');
    const animals = appModule.__get__('animals');
    let originalAnimals;
    request(app)
    .delete('/animals/1')
    .then((response) => {
      let found = animals.find((element) => {
        return element.id === 1;
      });
      expect(found, 'Does your DELETE `/animals/:id` route delete the proper element from the `animals` array?').to.not.be.ok;
      expect(response.status, 'Did you send a 204 response from the POST `/animals` route?').to.equal(204);
    })
    .then(() => {
      originalAnimals =  Array.from(animals);
      return request(app)
      .delete('/animals/invalid');
    })
    .then((response) => {
      expect(response.status, 'Your DELETE route should return 404 for an invalid ID.').to.equal(404);
      expect(animals, 'A DELETE `/animals/:id` should not alter update any animals on a request with invalid ID.').to.deep.equal(originalAnimals);
      done();
    })
    .catch(done);
  });
});
