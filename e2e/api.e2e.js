const request = require('supertest');

const chai = require('chai');
const expect = chai.expect;
const should = require("should");
// Inicializamos mockgoose
const Mockgoose = require('mockgoose').Mockgoose;
const mongoose = require('mongoose');
const mockgoose = new Mockgoose(mongoose);
const mongodbFixtures = require('./mongodb.fixtures');


//Importamos la app
const app = require('../app');


describe('Api E2E Tests', function() {

  var token;
  
  //Preparamos el escenario para los test del API
  before(function(done) {
        mockgoose.prepareStorage();
        mongoose.connect('mongodb://127.0.0.1:27017/TestingDB', {
            useMongoClient: true
        });
        // limpiamos las definiciones de modelos y esquemas de mongoose
        mongoose.models = {};
        mongoose.modelSchemas = {};
        //Metemos en la bbdd de pruebas unos datos
        mongodbFixtures.initAnuncios();    


        //Obtenemos la variable token para el resto de tests
        var credentials =  {
            "usuario": "user@example.com",
            "password": "1234"
        };
        
        request(app).post('/api/authenticate')
        .set('Accept', 'application/json')
        .send(credentials)
        .expect(function (res) {
            token = res.body.token;
        })
        .end(done);

    });


    it('GET /api should return 200', function(done) {
        request(app).get('/api').expect(200, done);
    });


    it('GET /api should return an error message in English', function(done) {
        request(app).get('/api/?idioma=en').
        expect({ Error: 'Not Found' }, done);
    });


    it('GET /api should return an error message in Spanish', function(done) {
        request(app).get('/api/?idioma=es').
        expect({ Error: 'No encontrado' }, done);
    });


    it('POST /api/authenticate without user and password should return an error', function(done) {
        request(app).post('/api/authenticate').
        expect( { success: false, error: 'Invalid credentials' }, done);
    });


    it('GET /api/anuncios without JWT token should return 401 response ', function(done) {
        request(app).get('/api/anuncios').expect(401);
        done();
    });  


    it('GET /api/busqueda without JWT token should return 401 response ', function(done) {
        request(app).get('/api/busqueda').expect(401);
        done();
    });  

    it('POST /api/authenticate with correct user and password should return a TOKEN', function(done) {
        
        var credentials =  {
            "usuario": "user@example.com",
            "password": "1234"
        };
        
        request(app).post('/api/authenticate')
        .set('Accept', 'application/json')
        .send(credentials)
        .expect(function (res) {
            expect(res.body.success).true;
            expect(res.body.token).exist;
        })
        .end(done);
    });


    it('GET /api/anuncios should return an array of 2 elements ', function(done) {
        request(app).get('/api/anuncios')
        .set('x-access-token', token)
        .expect(function (res) {
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.length(2);
        })
        .end(done);
    });


    it('GET /api/busqueda by name criteria should return an object with this name ', function(done) {
        
         request(app).get('/api/busqueda/?nombre=Bicicleta')
         .set('x-access-token', token)
         .expect(function(res) {
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.length(1);
        })
        .end(done);       
    });

    it('POST /api/crearAnuncio without valid credentials should return 401 response', function(done) {
        
        const anuncio= {
            "nombre": "prueba",
            "precio": 100,
            "descripcion": "Esto es una prueba"
        }

        request(app).post('/api/crearAnuncio').send(anuncio).expect({ ok: false, error: 'unauthorized' });
        done();

    }); 

   it('POST /api/crearAnuncio with valid credentials should return 200 response', function(done) {
        
        const anuncio= {
            "nombre": "prueba",
            "precio": 100,
            "descripcion": "Esto es una prueba"
        }
        request(app)
        .post('/api/crearAnuncio')
        .set('x-access-token', token)
        .send(anuncio)
        .expect(function(res) {
            expect(res.body.success).to.equal(true);
        })
        .end(done);       
    });
});  