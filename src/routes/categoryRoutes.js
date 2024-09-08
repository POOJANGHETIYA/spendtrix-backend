const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', categoryController.getCategories);
router.post('/', categoryController.createCategory);
//  Todo : Add routes for updateCategory and deleteCategory

module.exports = router;