import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import styled from 'styled-components';
import { Check, X, CreditCard, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentFormContainer = styled.div`
  background: #1a1a1a;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  margin: 0 auto;
  border: 1px solid #333;
`;

const FormTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: white;
  text-align: center;
`;

const FormSubtitle = styled.p`
  color: #ccc;
  text-align: center;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const CardElementContainer = styled.div`
  background: #2a2a2a;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #444;
`;

const PaymentButton = styled.button`
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  color: white;
  border: none;
  padding: 18px 36px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(255, 105, 180, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #888;
  font-size: 0.9rem;
  margin-top: 20px;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 10px;
  text-align: center;
`;

// Stripe Elements styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      '::placeholder': {
        color: '#888888',
      },
      backgroundColor: 'transparent',
    },
    invalid: {
      color: '#ff6b6b',
    },
  },
  hidePostalCode: true,
};

const PaymentFormElement = ({ plan, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (pmError) {
        setError(pmError.message);
        setLoading(false);
        return;
      }

      // Here you would typically send the payment method to your backend
      // to create a subscription or process the payment
      console.log('Payment method created:', paymentMethod);

      // Simulate successful payment
      toast.success('Payment processed successfully!');
      onSuccess(paymentMethod);

    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormTitle>Complete Your {plan.title} Subscription</FormTitle>
      <FormSubtitle>
        Secure payment powered by Stripe. Your payment information is encrypted and secure.
      </FormSubtitle>

      <CardElementContainer>
        <CardElement options={cardElementOptions} />
      </CardElementContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <PaymentButton type="submit" disabled={!stripe || loading}>
        {loading ? (
          <>
            <LoadingSpinner />
            Processing...
          </>
        ) : (
          <>
            <CreditCard size={20} />
            Subscribe for {plan.price}{plan.period}
          </>
        )}
      </PaymentButton>

      <SecurityNote>
        <Lock size={16} />
        Your payment information is secure and encrypted
      </SecurityNote>
    </form>
  );
};

const PaymentForm = ({ plan, onSuccess, onCancel }) => {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

  if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
    return (
      <PaymentFormContainer>
        <FormTitle>Payment Setup Required</FormTitle>
        <FormSubtitle>
          Please configure your Stripe publishable key to enable payments.
        </FormSubtitle>
        <PaymentButton onClick={onCancel}>
          <X size={20} />
          Close
        </PaymentButton>
      </PaymentFormContainer>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentFormElement 
        plan={plan} 
        onSuccess={onSuccess} 
        onCancel={onCancel} 
      />
    </Elements>
  );
};

export default PaymentForm;
