var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('lodash');
var morgan = require('morgan');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan());

var lions = [];
var id = 0;

app.param(['id'], function(req, res, next, paramID) {
    var lion =  _.find(lions, function(n) {
        return n.id === paramID;
    });

    if(!_.isEmpty(lion)) {
        req.lion = lion;
        next();
    } else {
        res.status(404).send({message: 'Not found'});
    }

});

app.get('/lions', function(req, res){
    res.status(200).send(lions);
});



app.get('/lion/:id', function(req, res){
    if(req.lion) {
        res.send(req.lion || {});
    } else {
        res.status(404).send('No data found.');
    }    
});

var updateID = function(req, res, next) {
    var lion = req.body;
    lion.id = ++id + '';

    next();
};

app.post('/lion', updateID, function(req, res) {
    var lion = req.body;
    console.log(lion);
    lions.push(lion);
    res.json(lion);
});

app.put('/lion/:id', function(req, res) {
    var update = req.body;
    if(update.id) {
        console.log('Inside delete block');
        delete update.id;
    }

    var lion = _.findIndex(lions, function(n) {
        return n.id === req.params.id;
    });

    if(!lions[lion]) {
        res.status(400).send('Data not found!');
    } else {
        var updatedLion = _.assign(lions[lion], update);
        res.send(updatedLion);
    }
});

app.delete('/lion/:id', function(req, res){
    var lion = _.remove(lions, function(n) {
       return n.id === req.params.id;
    });

    if(!_.isEmpty(lion)) {
        console.log(lion);
        res.send();
    }

    res.status(400).send();
});

app.use(function(err, req, res, next) {
    if(err) {
        res.status(500).send(err);
    }
});

var port = 3000;
app.listen(port, function() {
    console.log('Server listening at ', + port );
});