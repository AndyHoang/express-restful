var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/userlist', function(req, res, next) {
  var db = req.db;
  db.collection('userlist').find().toArray(function(err, items) {
    res.json(items);

  });
});

router.post('/adduser', function(req, res) {
  var db = req.db;
  db.collection('userlist').insert(req.body, function(err, result) {
    res.send(
      (err === null) ? {
        msg: ''
      } : {
        msg: err
      }
    );
  });
})

router.delete('/deleteuser/:id', function(req, res) {
  var db = req.db;
  db.collection('userlist').removeById(req.params.id, function(err, result) {
    res.send((result === 1) ? {
      msg: ''
    } : {
      msg: err
    });
  })
})

router.put('/updateuser/:id', function(req, res) {
  var db = req.db;
  db.collection('userlist').updateById(req.params.id, {
    $set: req.body
  }, function(err, result) {
    res.send((result === 1) ? {
      msg: ''
    } : {
      msg: err
    });
  })
})
module.exports = router;
