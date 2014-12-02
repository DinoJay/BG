exports.list = function(req, res, next){
  req.db.commentModel.find({$query: { tourId: req.tourId },
                    $orderby:{datetime:1}}, function(error, comments){
    if (error) console.log(error);
    console.log("found comments:");
    console.log(req);
    res.send({
      comments: comments
    });
  });
};

exports.add = function(req, res, next){
  if (!req.body) return next(new Error('No data provided.'));
  var comment = new req.db.commentModel({
    user : req.user.username,
    text : req.body.comment.text,
    datetime : Date(),
    tourId: req.tourId
  });
  comment.save(function(error, tour){
    if (error) return next(error);
    if (!tour) return next(new Error('Failed to save.'));
    console.info('Added %s with id=%s', tour, tour._id);

    req.db.commentModel.find({$query: { tourId: req.tourId }, 
                      $orderby:{datetime:1}}, function(error, comments){
      if (error) console.log(error);
      console.log("comments to send:");
      console.log(comments);
      res.send({
        comments: comments
      });
    });
  });
};
