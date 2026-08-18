const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// In a real app, these routes should be protected by a middleware 
// to ensure only admins can manage users.
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
