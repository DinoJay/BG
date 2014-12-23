Array.prototype.remove = function(value) {
var idx = this.indexOf(value);
if (idx != -1) {
    return this.splice(idx, 1); // The second parameter is the number of elements to remove.
}
return false;
};

exports.render = function(req, res) {
  res.render('tours', {});
};

exports.list = function(req, res, next){
  // TODO: find not by registered user
  req.db.tourModel.find({user: req.user.username}, function(error, tours){
    console.log("Req", req);
    console.log("found tours:");
    console.log(tours);
    res.send({
      user: req.user.username,
      tours: tours
    });
  });
};

exports.listAll = function(req, res, next){
  // TODO: find not by registered user
  req.db.tourModel.find({}, function(error, tours){
    console.log("Req", req);
    console.log("found tours:");
    //console.log(tours);
    res.send({
      user: req.user.username,
      tours: tours
    });
  });
};

exports.listRegTours = function(req, res, next){
  console.log(req.userId);
  req.db.tourModel.find({reg_users: req.userId}, function(error, tours){
    console.log("found tours:");
    console.log(tours);
    res.send({
      user: req.user.username,
      tours: tours
    });
  });
};

exports.change = function(req, res, next){
  if (!req.body)
    return next(new Error('No data provided.'));

    req.db.tourModel.findById(req.tourId, function (err, doc){
      if (!err) {
          doc.name       = req.body.name;
          doc.origin     = req.body.origin;
          doc.dest       = req.body.dest;
          doc.start_date = req.body.end_date;
          doc.end_date   = req.body.start_date;
          doc.pers       = req.body.pers;
          doc.difficulty = req.body.difficulty;
          doc.descr      = req.body.descr;
          doc.route      = req.body.route;
          doc.user       = req.user.username;

          doc.save();
          console.log("Change the following doc", doc._id);
          res.send("success");
      } else {
        res.send(err);
        console.log(err);
      }
  });
};

exports.del = function(req, res, next){
  if (!req.body)
    return next(new Error('No data provided.'));

    req.db.tourModel.findByIdAndRemove(req.tourId, function (doc, err){
      if (!err) {
          req.db.commentModel.findOneAndRemove({tourId:req.tourId},
            function(err) {
             if (!err) {
              res.send("success");
              console.log("tour and comments deleted");
            }
            else res.send(err);
            });

      } else {
        res.send(err);
        console.log(err);
      }
  });
};

exports.register = function(req, res, next){
  if (!req.body)
    return next(new Error('No data provided.'));

    console.log("REgister that shit");
    req.db.tourModel.findById(req.body._id, function (err, doc){
      if (!err) {
        console.log("Reg Users", doc.reg_users);
        if (doc.reg_users.indexOf(req.user.username) === -1) {
          console.log("User", req.user.username);
          doc.reg_users.push(req.user.username);
          doc.save();
          res.send("success");
          next();
        } else {
          res.send("failure");
          next();
        }
      } else console.log(err);
  });
};

exports.create = function(req, res, next){
  if (!req.body)
    return next(new Error('No data provided.'));

  var tour = new req.db.tourModel({
    name       : req.body.name,
    origin     : req.body.origin,
    dest       : req.body.dest,
    start_date : req.body.end_date,
    end_date   : req.body.start_date,
    pers       : req.body.pers,
    difficulty : req.body.difficulty,
    descr      : req.body.descr,
    route      : req.body.route,
    user       : req.user.username,
    tags       : req.body.tags
  });
  console.log("Tour creation", req.body.tags);

  tour.save(function(error, tour){
    if (error) return next(error);
    if (!tour) return next(new Error('Failed to save.'));
    console.info('Added %s with id=%s', tour._id);
    res.send("success");
  });
};

exports.deleteRegUser = function(req, res, next){
  if (!req.body)
    return next(new Error('No data provided.'));

    req.db.tourModel.findById(req.tourId, function (err, doc){
      if (!err) {
        console.log("delete Reg user for", req.body.user);
        console.log("find doc users: ", doc.reg_users);
        var userIndex = doc.reg_users.indexOf(req.body.user);
        if (userIndex !== -1) {
          doc.reg_users.remove(req.body.user);
          doc.save();
          console.log("find doc users: ", doc.reg_users);
          res.send("user removal, success");
        }
        else return next(new Error('No reg user can be found!'));

      } else console.log(err);
  });
};
