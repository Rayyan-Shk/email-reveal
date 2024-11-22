const { PrismaClient } = require('@prisma/client');
const { createRazorpayOrder, verifyPaymentSignature } = require('../utils/razorpayutils');

const prisma = new PrismaClient();

const initiatePayment = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const userId = req.user.userId; 

    
    const order = await createRazorpayOrder(amount, currency);

    
    const payment = await prisma.payment.create({
      data: {
        userId,
        razorpayOrderId: order.id,
        amount,
        status: 'PENDING'
      }
    });

    res.status(200).json({
      order,
      paymentId: payment.id
    });
  } catch (error) {
    console.error('Payment Initiation Error:', error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
};


const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;

    // Verify signature
    const isValidSignature = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!isValidSignature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    
    const payment = await prisma.payment.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        status: 'SUCCESS'
      },
      include: {
        user: true 
      }
    });

    res.status(200).json({
      message: 'Payment successful',
      user: {
        id: payment.user.id,
        email: payment.user.email
      },
      payment: {
        amount: payment.amount,
        status: payment.status
      }
    });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};


const getUserPayments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, name: true }
        }
      }
    });

    res.status(200).json(payments);
  } catch (error) {
    console.error('Get Payments Error:', error);
    res.status(500).json({ error: 'Failed to retrieve payments' });
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
  getUserPayments
};