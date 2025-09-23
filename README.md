# Velour - Premium Subscription Platform

A modern subscription-based video sharing and messaging platform built with React, Node.js, and Stripe integration.

## Features

### For Creators
- **Content Management**: Upload and manage videos, images, and text content
- **Subscription Tiers**: Set up different subscription levels (Basic, Premium, VIP)
- **Direct Messaging**: Communicate directly with subscribers
- **Analytics Dashboard**: Track earnings, subscriber count, and content performance
- **Payment Processing**: Secure payments through Stripe integration

### For Subscribers
- **Content Access**: Subscribe to creators for exclusive content
- **Direct Messaging**: Message your favorite creators
- **Multiple Subscriptions**: Subscribe to multiple creators
- **Pay-per-view**: Purchase individual pieces of content
- **User Dashboard**: Manage subscriptions and view content

### Technical Features
- **Real-time Messaging**: Socket.io powered chat system
- **Video Conferencing**: WebRTC-based video calls (legacy feature)
- **Secure Authentication**: JWT-based authentication system
- **File Upload**: Support for video, image, and audio files
- **Responsive Design**: Mobile-friendly interface
- **Payment Security**: Stripe integration with webhook handling

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Styled Components
- React Query
- React Hook Form
- React Hot Toast
- Stripe React Components
- Lucide React Icons

### Backend
- Node.js
- Express.js
- Socket.io
- MongoDB with Mongoose
- Stripe API
- JWT Authentication
- Multer (file uploads)
- Bcrypt (password hashing)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Stripe account
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd VideoChat
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Configuration

Create a `.env` file in the server directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5001

# Database
MONGODB_URI=mongodb://localhost:27017/velour

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

Create a `.env` file in the client directory:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
REACT_APP_API_URL=http://localhost:5001
```

### 4. Database Setup

Make sure MongoDB is running locally or update the `MONGODB_URI` in your `.env` file to point to your MongoDB instance.

### 5. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Set up webhooks in your Stripe dashboard pointing to `http://localhost:5001/api/webhooks/stripe`
4. Add the webhook secret to your `.env` file

### 6. Run the Application

#### Development Mode
```bash
# From the root directory
npm run dev
```

This will start both the server (port 5001) and client (port 3000) concurrently.

#### Production Mode
```bash
# Build the client
npm run build

# Start the server
npm start
```

### 7. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- API Documentation: http://localhost:5001/api/test

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Payments
- `POST /api/payments/setup-customer` - Setup Stripe customer
- `GET /api/payments/payment-methods` - Get payment methods
- `POST /api/payments/subscribe` - Create subscription
- `POST /api/payments/cancel-subscription/:id` - Cancel subscription
- `GET /api/payments/subscriptions` - Get user subscriptions
- `POST /api/payments/pay-per-view` - Create pay-per-view payment

### Content
- `POST /api/content/upload` - Upload content
- `GET /api/content/creator/:id` - Get creator's content
- `GET /api/content/:id` - Get specific content
- `GET /api/content/my-content` - Get user's content (creators)
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content
- `POST /api/content/:id/like` - Like content

### Messages
- `POST /api/messages/send` - Send message
- `GET /api/messages/conversation/:userId` - Get conversation
- `GET /api/messages/conversations` - Get all conversations
- `PUT /api/messages/mark-read/:userId` - Mark messages as read
- `DELETE /api/messages/:id` - Delete message
- `POST /api/messages/:id/react` - React to message

## Project Structure

```
VideoChat/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── config/            # Configuration files
│   └── index.js           # Server entry point
├── package.json           # Root package.json
└── README.md
```

## Deployment

### Environment Variables for Production
Make sure to set the following environment variables in your production environment:

- `NODE_ENV=production`
- `MONGODB_URI` (your production MongoDB URI)
- `JWT_SECRET` (a strong secret key)
- `STRIPE_SECRET_KEY` (your production Stripe secret key)
- `STRIPE_PUBLISHABLE_KEY` (your production Stripe publishable key)
- `STRIPE_WEBHOOK_SECRET` (your production webhook secret)

### Recommended Hosting Platforms
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Heroku, Railway, or AWS EC2
- **Database**: MongoDB Atlas
- **File Storage**: AWS S3, Cloudinary, or similar

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@pacmacmobile.com or create an issue in the repository.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Live streaming capabilities
- [ ] Multi-language support
- [ ] Advanced content moderation
- [ ] Creator verification system
- [ ] Referral program
- [ ] Advanced subscription management
