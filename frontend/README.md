# Assignment 
- A full-stack web-app as an assignment that allows users to manage and purchase lead information with secure authentication and payment integration.
Features

1. User Authentication (Email/Password & Google OAuth)
2. Lead Management System
3. Razorpay Payment Integration
4. Responsive Design
5. Pagination
6. Email Reveal System

## Tech Stack
1. Frontend

- React with Vite
- Tailwind CSS
- Google OAuth Integration
- Razorpay Integration

2. Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt Password Hashing

### Installation & Setup

## Frontend Setup

- cd frontend
  ```
  npm install
  npm run dev
  ```
1. Create a .env file in the frontend root:

- VITE_API_URL=http://localhost:3000
- VITE_GOOGLE_CLIENT_ID=your_google_client_id
- REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id

## Backend Setup
- cd backend
  ``` 
  npm install
  npx prisma migrate dev
  npm start
  ```
2. Create a .env file in the backend root:

- DATABASE_URL="postgresql://username:password@host:port/database"
- JWT_SECRET="your_jwt_secret"
- GOOGLE_CLIENT_ID="your_google_client_id"
- GOOGLE_CLIENT_SECRET="your_google_client_secret"
- FRONTEND_URL="http://localhost:5173"
- RAZORPAY_KEY_ID="your_razorpay_key_id"
- RAZORPAY_KEY_SECRET="your_razorpay_key_secret"

## API Endpoints
## Authentication

- POST /api/auth/signup - User registration
- POST /api/auth/login - User login
- POST /api/auth/google - Google OAuth login

## Leads

- GET /api/leads - Get paginated leads
- POST /api/leads/reveal - Reveal lead email (requires payment)

## Payments

- POST /api/payments/create-order - Create Razorpay order
- POST /api/payments/verify - Verify payment
