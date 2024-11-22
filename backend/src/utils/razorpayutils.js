const Razorpay = require('razorpay');
const shortid = require('shortid');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  
  const createRazorpayOrder = async (amount, currency = 'INR') => {
    const options = {
      amount: amount * 100,
      currency,
      receipt: shortid.generate(),
      payment_capture: 1 
    };
  
    try {
      const order = await razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('Razorpay Order Creation Error:', error);
      throw new Error('Failed to create Razorpay order');
    }
  };
  
  const verifyPaymentSignature = (orderDetails) => {
    try {
      const crypto = require('crypto');
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderDetails.razorpay_order_id}|${orderDetails.razorpay_payment_id}`)
        .digest('hex');
  
      return generatedSignature === orderDetails.razorpay_signature;
    } catch (error) {
      console.error('Signature Verification Error:', error);
      return false;
    }
  };
  
  module.exports = {
    razorpay,
    createRazorpayOrder,
    verifyPaymentSignature
  };