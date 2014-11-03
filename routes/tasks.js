exports.list = function(req, res, next){
  req.db.tasks.find({
    completed: false
  }).toArray(function(error, tasks){
    if (error) return next(error);
    res.render('tasks', {
      title: 'Todo List',
      tasks: tasks || []
    });
  });
};

exports.add = function(req, res, next){
  if (!req.body || !req.body.name) 
    return next(new Error('No data provided.'));
  req.db.tasks.save({
    name: req.body.name,
    completed: false
  }, function(error, task){
    if (error) return next(error);
    if (!task) return next(new Error('Failed to save.'));
    console.info('Added %s with id=%s', task.name, task._id);
    res.redirect('/tasks');
  });
};

exports.completed = function(req, res, next) {
  req.db.tasks.find({completed: true}).toArray(function(error, tasks) {
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
  req.task.completed = true;
  req.task.save();
  res.redirect('/tasks');
};

exports.del = function(req, res, next) {
  console.log("where am I");
  req.db.tasks.removeById(req.task._id, function(error, count) {
    if (error) return next(error);
    if (count !==1) return next(new Error('Something went wrong.'));
    console.info('Deleted task %s with id=%s completed.', 
                 req.task.name, req.task._id);
    res.send(200);
  });
};
