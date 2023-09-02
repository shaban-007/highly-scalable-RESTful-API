const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('API Endpoints', () => {
  it('should return a list of persons', (done) => {
    chai
      .request(app)
      .get('/getpersons')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should add a new person', (done) => {
    chai
      .request(app)
      .post('/addperson')
      .send({ title: 'New Person', body: 'Some description' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.equal('Person added');
        done();
      });
  });
});