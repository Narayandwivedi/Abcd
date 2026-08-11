const express = require('express');
const router = express.Router();
const {
  createSamaj,
  getAllSamaj,
  getSamajById,
  updateSamaj,
  deleteSamaj,
} = require('../controllers/samajController');

router.post('/', createSamaj);
router.get('/', getAllSamaj);
router.get('/:id', getSamajById);
router.put('/:id', updateSamaj);
router.delete('/:id', deleteSamaj);

module.exports = router;
