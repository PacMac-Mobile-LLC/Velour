# Stripe Integration Setup Guide

This guide will help you set up Stripe payments for your VideoChat application.

## 🚀 Quick Setup

### 1. Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** and **Secret key**
3. For testing, use the **Test keys** (start with `pk_test_` and `sk_test_`)

### 2. Configure Environment Variables

#### Server Environment (`.env` in server folder)
```bash
# Copy from stripe.env and update with your actual keys
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

#### Client Environment (`.env` in client folder)
```bash
# Copy from stripe.env and update with your actual keys
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key_here
REACT_APP_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_premium_monthly_here
REACT_APP_STRIPE_PREMIUM_YEARLY_PRICE_ID=price_premium_yearly_here
```

### 3. Create Stripe Products and Prices

Run the setup script to create the necessary products and prices:

```bash
# Load your Stripe secret key
source stripe.env

# Run the setup script
node stripe-setup.js
```

This will create:
- Premium Creator product
- Monthly and yearly pricing plans
- Enterprise product

### 4. Update Price IDs

After running the setup script, copy the generated price IDs and update your environment variables:

```bash
# Example output from stripe-setup.js:
# Premium Monthly: price_1ABC123...
# Premium Yearly: price_1DEF456...

# Update your .env files with these IDs
REACT_APP_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_1ABC123...
REACT_APP_STRIPE_PREMIUM_YEARLY_PRICE_ID=price_1DEF456...
```

## 🧪 Testing

### Test Cards
Use these test card numbers for testing:

- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`
- **Insufficient Funds**: `4000 0000 0000 9995`

### Test the Integration

1. Start your server:
   ```bash
   cd server && npm start
   ```

2. Start your client:
   ```bash
   cd client && npm start
   ```

3. Navigate to the pricing page and try subscribing to the Premium plan

## 🔧 Features Included

### ✅ What's Already Set Up

- **Stripe Context**: Complete payment context with all necessary functions
- **Payment Form**: Secure card input with Stripe Elements
- **Pricing Plans**: Creator, Premium, and Enterprise plans
- **Subscription Management**: Create, cancel, and manage subscriptions
- **Payment Methods**: Save and manage customer payment methods
- **Analytics**: Revenue and subscription analytics for creators
- **Pay-per-view**: Support for one-time payments
- **Webhook Support**: Ready for Stripe webhook integration

### 🎯 Payment Flows

1. **Creator Subscription**: Users can subscribe to creators with monthly/yearly billing
2. **Premium Creator Plan**: Creators can upgrade to premium features
3. **Pay-per-view**: One-time payments for exclusive content
4. **Enterprise**: Custom pricing for enterprise customers

## 🔒 Security

- All sensitive operations happen on the server
- Client only handles UI and non-sensitive data
- Webhook signature verification included
- PCI compliance through Stripe Elements

## 📊 Webhooks Setup

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-domain.com/api/payments/webhook`
3. Select events:
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

## 🚀 Going Live

When ready for production:

1. Switch to live keys in your environment variables
2. Update webhook endpoints to production URLs
3. Test with real (small) amounts
4. Update your domain in Stripe settings

## 📝 Environment Variables Reference

### Server (.env)
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Client (.env)
```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
REACT_APP_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_...
REACT_APP_STRIPE_PREMIUM_YEARLY_PRICE_ID=price_...
```

## 🆘 Troubleshooting

### Common Issues

1. **"Stripe not initialized"**: Check your publishable key
2. **"Invalid API key"**: Verify your secret key is correct
3. **"Price not found"**: Run `stripe-setup.js` to create products
4. **Webhook errors**: Check webhook endpoint and secret

### Debug Mode

Enable Stripe debug logging:
```bash
export STRIPE_DEBUG=true
```

## 📞 Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [React Stripe.js Docs](https://stripe.com/docs/stripe-js/react)
