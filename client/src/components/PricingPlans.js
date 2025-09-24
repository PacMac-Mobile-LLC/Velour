import React, { useState } from 'react';
import { useAuth0Context } from '../contexts/Auth0Context';
import { useStripe } from '../contexts/StripeContext';
import styled from 'styled-components';
import { Star, Check, Zap, Crown, Shield, X } from 'lucide-react';
import toast from 'react-hot-toast';
import PaymentForm from './PaymentForm';

const PricingContainer = styled.div`
  background: #111;
  padding: 100px 20px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  color: #ccc;
  margin-bottom: 60px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
`;

const PricingCard = styled.div`
  background: #1a1a1a;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  border: 2px solid ${props => props.featured ? '#ff69b4' : '#333'};
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    border-color: #ff69b4;
  }
`;

const PricingBadge = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const PricingTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const PricingPrice = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: #ff69b4;
  margin-bottom: 20px;
`;

const PricingFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
`;

const PricingFeature = styled.li`
  color: #ccc;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const GetStartedButton = styled.button`
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
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.3);

  &:hover {
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: #1a1a1a;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid #333;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: #333;
    color: white;
  }
`;

const PricingPlans = () => {
  const { isAuthenticated, user } = useAuth0Context();
  const { createSubscription, loading } = useStripe();
  const [processingPlan, setProcessingPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const pricingPlans = [
    {
      id: 'creator',
      title: 'Creator',
      icon: <Star size={24} />,
      price: 'Free',
      features: [
        'Upload unlimited content',
        'Set custom subscription prices',
        'Direct messaging with fans',
        'Analytics dashboard',
        'Basic support'
      ],
      action: 'Start Free'
    },
    {
      id: 'premium',
      title: 'Premium Creator',
      icon: <Crown size={24} />,
      price: '$29',
      period: '/month',
      featured: true,
      features: [
        'Everything in Creator',
        'Priority customer support',
        'Advanced analytics',
        'Custom branding',
        'Early access to new features',
        'Revenue optimization tools'
      ],
      action: 'Upgrade Now',
      stripePriceId: process.env.REACT_APP_STRIPE_PREMIUM_MONTHLY_PRICE_ID || 'price_premium_monthly'
    },
    {
      id: 'enterprise',
      title: 'Enterprise',
      icon: <Shield size={24} />,
      price: 'Custom',
      features: [
        'Everything in Premium',
        'Dedicated account manager',
        'Custom integrations',
        'White-label solution',
        '24/7 phone support',
        'Custom pricing structure'
      ],
      action: 'Contact Sales'
    }
  ];

  const handlePlanSelection = async (plan) => {
    if (!isAuthenticated) {
      toast.error('Please log in to select a plan');
      return;
    }

    if (plan.id === 'creator') {
      // Free plan - just redirect to dashboard
      toast.success('Welcome to Velour Creator!');
      // You can add logic here to update user role to 'creator'
      return;
    }

    if (plan.id === 'enterprise') {
      // Enterprise plan - redirect to contact form
      toast.success('Redirecting to contact form...');
      // You can add logic here to open a contact form or redirect
      return;
    }

    if (plan.id === 'premium') {
      // Show payment modal for premium plan
      setSelectedPlan(plan);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = (paymentMethod) => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
    toast.success('Payment successful! Welcome to Premium Creator!');
    // Here you could redirect to dashboard or update user state
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  return (
    <>
    <PricingContainer>
      <Container>
        <SectionTitle>Creator Pricing</SectionTitle>
        <SectionSubtitle>
          Choose the plan that works best for your creative journey
        </SectionSubtitle>
        
        <PricingGrid>
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} featured={plan.featured}>
              {plan.featured && <PricingBadge>Most Popular</PricingBadge>}
              <PricingTitle>
                {plan.icon}
                {plan.title}
              </PricingTitle>
              <PricingPrice>
                {plan.price}
                {plan.period && <span style={{ fontSize: '1rem', color: '#ccc' }}>{plan.period}</span>}
              </PricingPrice>
              <PricingFeatures>
                {plan.features.map((feature, index) => (
                  <PricingFeature key={index}>
                    <Check size={16} color="#ff69b4" />
                    {feature}
                  </PricingFeature>
                ))}
              </PricingFeatures>
              <GetStartedButton 
                onClick={() => handlePlanSelection(plan)}
                disabled={loading || processingPlan === plan.id}
              >
                {processingPlan === plan.id ? (
                  <>
                    <LoadingSpinner />
                    Processing...
                  </>
                ) : (
                  plan.action
                )}
              </GetStartedButton>
            </PricingCard>
          ))}
          </PricingGrid>
        </Container>
      </PricingContainer>

      {showPaymentModal && selectedPlan && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={handlePaymentCancel}>
              <X size={24} />
            </CloseButton>
            <PaymentForm
              plan={selectedPlan}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default PricingPlans;
