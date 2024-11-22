const express = require('express');
const { 
  initiatePayment, 
  verifyPayment, 
  getUserPayments 
} = require('../controllers/paymentController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/create-order', authenticateUser, initiatePayment);

router.post('/verify', verifyPayment);

router.get('/history', authenticateUser, getUserPayments);

module.exports = router;