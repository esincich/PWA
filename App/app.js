var express = require ('express');
var path = require('path');
//var logger = require('morgan');
//var bodyParser = require('body-parser');
const neo4j = require('neo4j-driver');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('pwa','1234'));
const session = driver.session();


app.get('/', function(req, res) {
   
   //Se pueden armar muchas session distintas
    session 
        .run('MATCH(n:Movie) RETURN n LIMIT 25')
        .then(function(result) { 
               //****NO BORRAR LA LINEA DE ABAJO****
                       //   console.log(record._fields[0].properties);

            //creo un array
            var movieArr = [];
            //recorro lo que me devuelve la consulta
            result.records.forEach(function(record){
                //armo objeto e inserto en el array
                movieArr.push({
                    //meto las propiedades que quiero para mi objeto
                    id: record._fields[0].identity.low,
                    title: record._fields[0].properties.title,
                    year: record._fields[0].properties.year
                });
              
               });


           session 
               .run('MATCH(n:Actor) RETURN n LIMIT 25')
               .then(function(result2) { 
                   //creo un array
                   var actorArray = [];
                   //recorro lo que me devuelve la consulta
                   result2.records.forEach(function(record2){
                       //armo objeto e inserto en el array
                       actorArray.push({
                           //meto las propiedades que quiero para mi objeto
                           id: record2._fields[0].identity.low,
                           nombre: record2._fields[0].properties.title

                       });
                    
                        
                      });
                         //aca mandamos a la vista(index en este caso)          
            res.render('index' ,{
                movies: movieArr,
                actores: actorArray
        });
       // res.send('anda');

                    })
                    .catch(function(err){
                        console.log(err);
                    }); 

         

        })
        .catch(function(err){
            console.log(err);
        });


    
    // res.send('anda');
});

app.listen(80);
console.log ('Servidor a la escucha 192.168.0.80:80');


