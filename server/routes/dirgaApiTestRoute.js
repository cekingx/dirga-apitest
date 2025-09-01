const express = require('express');
const { read, write } = require('../controllers/dirgaApiTestController');

const router = express.Router();

router.route('/dirgaApiTest/read').get(read);
router.route('/dirgaApiTest/write').post(write);

module.exports = router;
