'use strict';

var multiparty = require('multiparty');  //importing multiparty
var albums = global.nss.db.collection('albums');
var fs = require('fs');
var Mongo = require('mongodb');

exports.index = (req, res)=>{
  albums.find().toArray((e,r)=>{
    res.render('albums/index', {albums: r, title: 'Albums'});
  });
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();  //this is just how you use multiparty to pull pics

  form.parse(req, (err, fields, files)=>{    //req is object that came from the browser, files are the pics, fields are where the other inputs are
    var album = {};
    album.title = fields.title[0];
    album.date = new Date(fields.date[0]);
    album.photos = [];

    files.photos.forEach(p=>{
      fs.renameSync(p.path, `${__dirname}/../static/img/${p.originalFilename}`);
      album.photos.push(p.originalFilename);
    });

    console.log('----');
    console.log(fields);
    console.log(files);

    albums.save(album, ()=>res.redirect('/albums'));
  });
};

exports.show = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.id);

  albums.findOne({_id:_id}, (e, album)=>{
    res.render('albums/show', {album: album, title: 'Album'});
  });
};
