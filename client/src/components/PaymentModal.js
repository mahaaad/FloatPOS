import React, { useState } from 'react';
import Modal from 'react-modal';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../style/paymentModal.scss';

const key =`pk_test_51J6PWwEnEMhMVMfh1Tz0EtUlSwP6vXHWgoS5rD31BB27zg1HN5ivoWBgRf5bSf7uJj5jC0qqVU0BILn4JxrZ9cLP006YNpsZIg`
const stripePromise = loadStripe(key);

const PaymentModal = ({ isOpen, onRequestClose, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPaymentProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message);
        setPaymentProcessing(false);
        return;
      }

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id, amount: total * 100 }),
      });

      const paymentIntent = await response.json();
      const confirmedPayment = await stripe.confirmCardPayment(paymentIntent.clientSecret);

      if (confirmedPayment.error) {
        setError(confirmedPayment.error.message);
        setPaymentProcessing(false);
        return;
      }

      setSuccess(true);
      setPaymentProcessing(false);
    } catch (err) {
      setError(err.message);
      setPaymentProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Payment Modal" className="payment-modal">
      <h2>Complete Payment</h2>
      <form onSubmit={handleSubmit}>
        <CardElement />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={!stripe || paymentProcessing}>
          {paymentProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
        </button>
      </form>
      {success && <div className="success">Payment Successful!</div>}
    </Modal>
  );
};

const PaymentModalWrapper = ({ isOpen, onRequestClose, total }) => (
  <Elements stripe={stripePromise}>
    <PaymentModal isOpen={isOpen} onRequestClose={onRequestClose} total={total} />
  </Elements>
);

export default PaymentModalWrapper;
