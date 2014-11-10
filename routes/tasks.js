exports.list = function(req, res, next){
  req.db.model.find({
    completed: false
  }, function(error, tasks){
    if (error) return next(error);
    res.render('tasks', {
      title: 'Todo List',
      tasks: tasks || []
    });
  });
};

exports.add = function(req, res, next){
  var TaskModel = req.db.model;
  var task = new TaskModel({
    name: req.body.name,
    completed: false
  });
  if (!req.body || !req.body.name) 
    return next(new Error('No data provided.'));

  task.save(function(error, task){
    if (error) return next(error);
    if (!task) return next(new Error('Failed to save.'));
    console.info('Added %s with id=%s', task.name, task._id);
    res.redirect('/tasks');
  });
};

exports.completed = function(req, res, next) {
  req.db.model.find({completed: true}).toArray(function(error, tasks) {
    res.render('tasks_completed', {
      title: 'Completed',
      tasks: tasks || []
    });
  });
};

exports.markAllCompleted = function(req, res, next) {
  if (!req.body.all_done || req.body.all_done !== 'true') return next();
  req.db.model.find({completed: false}, function(error, tasks){
    if (error) return next(error);
    tasks.forEach(function(task){
      task.completed = true;
      task.save();
    });
    res.redirect('/tasks');
    
  });

};

exports.markCompleted = function(req, res, next) {
  if (!req.body.completed) return next(new Error('Param is missing'));
  req.db.model.findOne({_id: req.task._id}, function(error, task){
    if (error) return next(error);
    task.completed = true;
    task.save();
    res.redirect('/tasks');
  });
};

exports.del = function(req, res, next) {
  req.db.model.findOneAndRemove({_id: req.task._id}, 
                                function(error, task) {
    console.log(task);
    if (error) return next(error);
    res.send(200);
  });
};
