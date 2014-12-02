exports.render = function(req, res) {
  res.render('tours', {});
};

exports.list = function(req, res, next){
  // TODO: find not by registered user
  req.db.tourModel.find({}, function(error, tours){
    console.log("found tours:");
    console.log(res.locals.user);
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
          console.log("Change the following doc", doc);
          res.send("success");
      } else {
        res.send(err);
        console.log(err);
      }
  });
};

exports.register = function(req, res, next){
  if (!req.body) 
    return next(new Error('No data provided.'));

    req.db.tourModel.findById(req.body._id, function (err, doc){
    if (!err) {
      if (doc.reg_users.indexOf(req.user.username) !== -1) {
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
  });
  if (!req.body) 
    return next(new Error('No data provided.'));

  tour.save(function(error, tour){
    if (error) return next(error);
    if (!tour) return next(new Error('Failed to save.'));
    console.info('Added %s with id=%s', tour, tour._id);
    res.send("success");
  });
};
