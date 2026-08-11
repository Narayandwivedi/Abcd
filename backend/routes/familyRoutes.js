const express = require('express');
const router = express.Router();
const {
  createFamily,
  getAllFamilies,
  getFamilyById,
  updateFamily,
  deleteFamily,
} = require('../controllers/familyController');

router.post('/', createFamily);
router.get('/', getAllFamilies);
router.get('/:id', getFamilyById);
router.put('/:id', updateFamily);
router.delete('/:id', deleteFamily);

module.exports = router;
