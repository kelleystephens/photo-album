'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var albums = traceur.require(__dirname + '/../routes/albums.js');

  app.get('/', dbg, home.index);
  app.get('/albums', dbg, albums.index);
  app.post('/albums', dbg, albums.create);
  app.get('/albums/:id', dbg, albums.show);
  console.log('Routes Loaded');
  fn();
}
