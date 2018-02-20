var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    const collection = db.get('merida').collection('documents');
    await collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]);
    const docs = await collection.find({}).toArray();
    res.json(docs);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
