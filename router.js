const express = require('express');
const router = express.Router();
const distanceService = require('./services/distance');


const cors = require('cors');

router.all('*', cors());

router.route('/distance').get(distanceService.get);
router.route('/distance').post(distanceService.create);
router.route('/popularsearch').get(distanceService.getpopularsearch);
module.exports = router;
