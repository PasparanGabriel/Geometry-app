var express = require('express');
var is = require('is_js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.isLoggedIn) {
    if (req.session.user.user_type === 'student') {
      return res.render('editor_student', {
        full_name: req.session.user.first_name + ' ' + req.session.user.last_name
      }); 
    } else if (req.session.user.user_type === 'teacher') {
      return res.render('editor_teacher', {
        full_name: req.session.user.first_name + ' ' + req.session.user.last_name
      }); 
    }
  } else {
    return res.render('editor_logout');
  }
});

router.get('/delete-exercise/:exerciseId', function(req, res, next) {
  if (req.session.isLoggedIn && req.session.user.user_type === 'teacher') {
    req.getConnection(function(err, connection) {
      if (err) return next(err);
      let exerciseId = req.params.exerciseId;
  
      // delete all answers

      let query = `delete from solutions where id_question = ?;`;

      connection.query(query, [exerciseId], function(err, results) {
        if (err) return next(err);

        //delete the exercise
        let queryDeleteExercise = `delete from exercises where id = ?;`;

        connection.query(queryDeleteExercise, [exerciseId], function(err, results) {
          if (err) return next(err);
          
          return res.redirect('/exercises');
        });
        
      });
    });
  } else {
    return res.redirect('/');
  }
});

router.get('/view-exercise/:exerciseId', function(req, res, next) {
  if (req.session.isLoggedIn && req.session.user.user_type === 'teacher') {
    req.getConnection(function(err, connection) {
      if (err) return next(err);

      let exerciseId = req.params.exerciseId;
  
      let query = `select id,  DATE_FORMAT(post_date, "%d %M %Y %H:%i") as date, title, content from exercises where id = ?;`;
  
      connection.query(query, [exerciseId], function(err, results) {
        if (err) return next(err);
        
          if (results.length === 0)
            return res.redirect('/exercises');

          getSolutionsForPost(connection, exerciseId, (err, comments) => {
            if (err) return next(err);

            return res.render('exercise_page', {
              full_name: req.session.user.first_name + ' ' + req.session.user.last_name,
              exercise: results[0],
              answers: comments
            }); 
          });

      });
    });
  } else {
    return res.redirect('/');
  }
});

function getSolutionsForPost(connection, exerciseId, callback) {
  let query = `
  select s.id as id, concat(u.first_name, concat(' ', u.last_name)) as full_name, DATE_FORMAT(s.post_date, "%d %M %Y %H:%i") as date, s.grade as grade, s.answer as answer
  from solutions s join users u on s.id_user = u.id
  where id_question = ? order by post_date desc;
  `;

  connection.query(query, [exerciseId], function(err, results) {
    if (err) return callback(err, null);
    
    callback(null, results);
  });
}

router.post('/save-grade', function(req, res, next) {
  if (req.session.isLoggedIn && req.session.user.user_type === 'teacher') {
    req.getConnection(function(err, connection) {
      if (err) return next(err);

      let grade = req.body.grade,
          answer = req.body.answer,
          exerciseId = req.body.exercise;
  
      let query = `update solutions set grade = ? where id = ?;`;
  
      connection.query(query, [grade, answer], function(err, results) {
        if (err) return next(err);

        return res.redirect('/view-exercise/' + exerciseId);
    
      });
    });
  } else {
    return res.redirect('/');
  }
});


router.get('/erase-grade/:answerId/:exerciseId', function(req, res, next) {
  if (req.session.isLoggedIn && req.session.user.user_type === 'teacher') {
    req.getConnection(function(err, connection) {
      if (err) return next(err);

      let answerId = req.params.answerId,
          exerciseId = req.params.exerciseId;
  
      let query = `update solutions set grade = NULL where id = ?;`;
  
      connection.query(query, [answerId], function(err, results) {
        if (err) return next(err);

        return res.redirect('/view-exercise/' + exerciseId);
    
      });
    });
  } else {
    return res.redirect('/');
  }
});

router.get('/exercises', function(req, res, next) {
  if (req.session.isLoggedIn) {
    if (req.session.user.user_type === 'student') {
      req.getConnection(function(err, connection) {
        if (err) return next(err);

        let idUser = req.session.user.id;
    
        let query = `
        select b.id, b.full_name, b.title, b.content, ifnull(a.number_of_answers, 0) as nr_answers, b.date
        from
        (select id_question, count(*) as number_of_answers
        from solutions
        where id_user = ?
        group by id_question) as a
        right join
        (select e.id as id, concat(u.first_name, concat(' ', u.last_name)) as full_name, DATE_FORMAT(e.post_date, "%d %M %Y %H:%i") as date, e.title as title, e.content as content
        from users u join exercises e on u.id = e.id_teacher) as b
        on a.id_question = b.id
        order by b.date desc;
        `;
    
        connection.query(query, [idUser], function(err, results) {
          if (err) return next(err);
          
            return res.render('exercises_student', {
              full_name: req.session.user.first_name + ' ' + req.session.user.last_name,
              exercises: results
            }); 
        });
      });
    } else if (req.session.user.user_type === 'teacher') {
      req.getConnection(function(err, connection) {
        if (err) return next(err);

        let idUser = req.session.user.id;
    
        let query = `select * from exercises where id_teacher = ? order by post_date desc;`;
    
        connection.query(query, [idUser], function(err, results) {
          if (err) return next(err);
          
            return res.render('exercises_teacher', {
              full_name: req.session.user.first_name + ' ' + req.session.user.last_name,
              exercises: results
            }); 
        });
      });
    }
  } else {
    return res.redirect('/');
  }
});

router.post('/view-answer', function(req, res, next) {
  if (req.session.isLoggedIn) {
    let userId = req.session.user.id,
        questionId = req.body.id;

    req.getConnection(function(err, connection) {
      if (err) return res.json({status: 'ERROR', message: 'Could not connect to the database.'});
  
      let query = `
        select concat(u.first_name, concat(' ', u.last_name)) as full_name, DATE_FORMAT(s.post_date, "%d %M %Y %H:%i") as answer_date,
        DATE_FORMAT(e.post_date, "%d %M %Y %H:%i") as exercise_date, e.content as question, s.answer as answer, e.title as title, s.grade as grade
        from solutions s, users u, exercises e
        where s.id_question = e.id and s.id_user = u.id and e.id = ? and u.id = ?;
      `;

      let params = [questionId, userId];
  
      connection.query(query, params, function(err, results) {
        if (err) return res.json({status: 'ERROR', message: 'Could not query the database.'});

          if (results.length === 0)
            return res.json({status: 'ERROR', message: 'Not data found.'});

          return res.json({
            status: 'SUCCESS',
            message: 'The answer has been found.',
            data: results[0]
          });
      });
    });

  } else {
    return res.json({status: 'ERROR', message: 'The user is not logged in.'});
  }
});

router.post('/save-answer', function(req, res, next) {
  if (req.session.isLoggedIn) {
    let userId = req.session.user.id,
        exerciseId = req.body.questionId,
        answer = req.body.answer;

    req.getConnection(function(err, connection) {
      if (err) return res.json({status: 'ERROR', message: 'Could not connect to the database.'});
  
      let query = 'INSERT INTO solutions(id_question, id_user, answer) VALUES (?, ?, ?);';
      let params = [exerciseId, userId, answer];
  
      connection.query(query, params, function(err, results) {
        if (err) return res.json({status: 'ERROR', message: 'Could not save data to database.'});
        
          return res.json({status: 'SUCCESS', message: 'The answer has been saved with success.'});
      });
    });

  } else {
    return res.json({status: 'ERROR', message: 'The user is not logged in.'});
  }
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('register', {hasError: false});
});

router.post('/register', function(req, res, next) {
  req.getConnection(function(err, connection) {
    if (err) return next(err);

    // data from form
    let first_name = req.body.first_name,
        last_name = req.body.last_name,
        username = req.body.username,
        password = req.body.password,
        passwordRetype = req.body.passwordRetype
        user_type = req.body.user_type;

    let errors = {};
    let values = {first_name, last_name, username};
    let hasError = false;
    let errorMessage = '';

    // validate data 
    if (is.empty(first_name) || is.empty(last_name) || is.empty(username) || is.empty(password)) {
      if (is.empty(first_name)) errors.first_name = true;
      if (is.empty(last_name)) errors.last_name = true;
      if (is.empty(username)) errors.username = true;
      if (is.empty(password)) errors.password = true;

      hasError = true;
      errorMessage = 'Campurile nu pot fi lasate necompletate.';
    }

    if (password.length < 4) {
      errors.password = true;

      hasError = true;
      errorMessage += 'Parola este prea scurta. Trebuie sa aiba minim 4 caractere.';
    }

    if (password !== passwordRetype) {
      errors.password = true;
      errors.passwordRetype = true;

      hasError = true;
      errorMessage += 'Parola reintrodusa difera de parola initiala.';
    }

    if (first_name.length < 2
        || last_name.length < 2
        || !allLetters(first_name)
        || !allLetters(last_name)) {

      
      if (first_name.length < 2 || !allLetters(first_name))
          errors.first_name = true;

      if (last_name.length < 2 || !allLetters(last_name))
          errors.last_name = true;

      hasError = true;
      errorMessage += 'Numele si prenumele trebuie sa aiba minim 3 caractere si sa contina numai litere.';
    }

    if (!isValidUsername(username)) {
      hasError = true;
      errorMessage += 'Numele de utilizator trebuie sa inceapa cu o litera, urmata apoi de litere si cifre, si sa aiba in total minim 4 caractere.';
      errors.username = true;
    }

    if (hasError) {
      return res.render('register', {
        hasError,
        errorMessage,
        errors,
        values
      });
    }

    let query = `
        INSERT INTO users(username, password, first_name, last_name, register_date, user_type)
          VALUES (?, ?, ?, ?, now(), ?)
    `;

    let params = [username, password, first_name, last_name, user_type];

    connection.query(query, params, function(err, results) {
      if (err) return next(err);
      // user saved succesfully

      // results.insertId
      let queryInsertedUser = 'SELECT * FROM users WHERE id = ?';
      let paramsInsertedUser = [results.insertId];
      
      connection.query(queryInsertedUser, paramsInsertedUser, function(err, results) {
        if (err) return next(err);
        if (results.length === 0) return next(err);
  
        // set the current session
        req.session.isLoggedIn = true;
        req.session.user = results[0];

        res.redirect('/');
      });
    });
  });
});

function isValidUsername(username) {
  if (username.length < 4) {
      return false;
  } else {
      if (!isLetter(username[0])) return false;

      for (let i = 1; i < username.length; i++) {
          if (!isLetter(username[i]) && !isDigit(username[i])) {
              return false;
          }
      }

      // valid username
      return true;
  }
}

function isDigit(ch) {
  return ch >= '0' && ch <= '9';
}

function isLetter(ch) {
  return (ch >= 'a' &&  ch <= 'z') || (ch >= 'A' && ch <= 'Z');
}

function allLetters(str) {
  for (let i = 0; i < str.length; i++) {
    if (!isLetter(str[i])) return false;
  }
  return true;
}

// LogOut
router.get('/logout', function(req, res, next) {
  req.session.destroy();  // destroy the current session;
  res.redirect('/');
});

router.post('/login', function(req, res, next) {
  req.getConnection(function(err, connection) {
    if (err) return next(err);

    let query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    let params = [req.body.username, req.body.password];
    
    connection.query(query, params, function(err, results) {
      if (err) return next(err);

      if (results.length === 0) {
        return res.render('login', {
          hasError: true,
          errorMessage: 'Utilizatorul sau parola este invalida.'
        });
      }

      if (results[0].password == req.body.password) {
        // set the current session
        req.session.isLoggedIn = true;
        req.session.user = results[0];
        res.redirect('/');
      } else {
        return res.render('login', {
          hasError: true,
          errorMessage: 'Utilizatorul sau parola este invalida.'
        });
      }
      
    });
  });
});

router.get('/editor', function(req, res, next) {
  res.render('editor');
});

// Get dashboard page
router.get('/dashboard', function(req, res, next) {
  if (req.session.isLoggedIn) {
    if (req.session.user.user_type === 'student') {
      return res.render('dashboard_student', {
        full_name: req.session.user.first_name + ' ' + req.session.user.last_name
      }); 
    } else if (req.session.user.user_type === 'teacher') {
      return res.render('dashboard_teacher', {
        full_name: req.session.user.first_name + ' ' + req.session.user.last_name
      }); 
    }
  } else {
    // unregistred users
    return res.redirect('/');
  }
});

// Get settings page
router.get('/settings', function(req, res, next) {
  if (req.session.isLoggedIn) {
    return res.render('settings', {
      full_name: req.session.user.first_name + ' ' + req.session.user.last_name,
      first_name: req.session.user.first_name,
      last_name: req.session.user.last_name
    });
  } else {
    // unregistred users
    return res.redirect('/');
  }
});

router.post('/add-exercise', function(req, res, next) {
  if (req.session.isLoggedIn && req.session.user.user_type === 'teacher') {
    let title = req.body.title,
        exercises = req.body.exercises;

    // validate data
    if (strmin(title, 1) && strmin(exercises, 1)) {
      
      let userId = req.session.user.id;

      req.getConnection(function(err, connection) {
        if (err) return next(err);
    
        let query = 'INSERT INTO exercises(id_teacher, title, content) VALUES (?, ?, ?)';
        let params = [userId, title, exercises];
        
        connection.query(query, params, function(err, results) {
          if (err) return next(err);

          // redirect to login
          res.redirect('/exercises');
        });
      });
    } else {
      return res.redirect('/exercises');
    }
  } else {
    // unregistred users
    return res.redirect('/');
  }
});

router.post('/change-name', function(req, res, next) {
  if (req.session.isLoggedIn) {
    let first_name = req.body.first_name,
        last_name = req.body.last_name;

    // validate data
    if (strmin(first_name, 3) && strmin(last_name, 3)) {
      
      let userId = req.session.user.id;

      req.getConnection(function(err, connection) {
        if (err) return next(err);
    
        let query = 'UPDATE users SET first_name = ?, last_name = ? WHERE id = ?';
        let params = [first_name, last_name, userId];
        
        connection.query(query, params, function(err, results) {
          if (err) return next(err);
    
          // disconnect
          req.session.destroy();  // destroy the current session;

          // redirect to login
          res.redirect('/login');
        });
      });
    } else {
      return res.redirect('/settings');
    }
  } else {
    // unregistred users
    return res.redirect('/');
  }
});

router.post('/change-password', function(req, res, next) {
  if (req.session.isLoggedIn) {
    let old_password = req.session.user.password,
        new_password = req.body.new_password;

    if (strmin(new_password, 4) && new_password !== old_password) {
      
      let userId = req.session.user.id;

      req.getConnection(function(err, connection) {
        if (err) return next(err);
    
        let query = 'UPDATE users SET password = ? WHERE id = ?';
        let params = [new_password, userId];
        
        connection.query(query, params, function(err, results) {
          if (err) return next(err);
    
          // disconnect
          req.session.destroy();  // destroy the current session;

          // redirect to login
          res.redirect('/login');
        });
      });
      
    } else {
      return res.redirect('/settings');
    }
  } else {
    // unregistred users
    return res.redirect('/');
  }
});

router.post('/delete-account', function(req, res, next) {
  if (req.session.isLoggedIn) {
     
      let userId = req.session.user.id;

      req.getConnection(function(err, connection) {
        if (err) return next(err);
    
        let query = 'DELETE FROM users WHERE id = ?';
        let params = [userId];
        
        connection.query(query, params, function(err, results) {
          if (err) return next(err);
    
          // disconnect
          req.session.destroy();  // destroy the current session;

          // redirect to login
          res.redirect('/');
        });
        
      });
  } else {
    // unregistred users
    return res.redirect('/');
  }
});

module.exports = router;

// --- UTIL FUNCTIONS ---
// string minim
function strmin(str, min) {
  return str.length >= min;
}
