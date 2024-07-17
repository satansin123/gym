const express = require('express');
const router = express.Router();
const {
    calorieEntry,
    getCalorie,
    updateCalorie,
    deleteCalorie
} = require('../controllers/calorieController');


router.post('/Addcalorie', calorieEntry);
router.get('/Viewcalories', getCalorie);
router.patch('/Viewcalories:id', updateCalorie);
router.delete('/Viewcalories:id', deleteCalorie);

module.exports = router;
