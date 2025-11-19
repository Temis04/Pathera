# Pathera Backend API

Secure backend server for handling Stripe payments, webhooks, and subscription management.

## Features

- 🔐 Secure Stripe integration
- 💳 Subscription management
- 🔔 Webhook handling
- 🗄️ Supabase integration
- ✅ Payment validation

## Setup Instructions

### 1. Install Dependencies

```bash
cd pathera-backend
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Fill in your credentials in `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Supabase (get from project settings)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (get from Stripe dashboard)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PREMIUM_PRICE_ID=price_...

# Frontend
FRONTEND_URL=http://localhost:5173
```

### 3. Create Stripe Product & Price

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Create a new product: "Pathera Premium"
3. Set price: $9.99/month (or your preferred price)
4. Copy the **Price ID** (starts with `price_`)
5. Add to `.env` as `STRIPE_PREMIUM_PRICE_ID`

### 4. Setup Stripe Webhooks

#### For Local Development (using Stripe CLI):

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe:
   ```bash
   stripe login
   ```
3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_`)
5. Add to `.env` as `STRIPE_WEBHOOK_SECRET`

#### For Production:

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Create new endpoint: `https://yourdomain.com/webhook`
3. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the signing secret
5. Add to production `.env`

### 5. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will start on `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /health
```

### Create Checkout Session
```
POST /api/create-checkout-session
Body: {
  "userId": "uuid",
  "priceId": "price_xxx"
}
Response: {
  "sessionId": "cs_xxx",
  "url": "https://checkout.stripe.com/..."
}
```

### Create Customer Portal Session
```
POST /api/create-portal-session
Body: {
  "customerId": "cus_xxx"
}
Response: {
  "url": "https://billing.stripe.com/..."
}
```

### Cancel Subscription
```
POST /api/cancel-subscription
Body: {
  "subscriptionId": "sub_xxx"
}
Response: {
  "success": true,
  "subscription": {...}
}
```

### Get Subscription Details
```
GET /api/subscription/:userId
Response: {
  "subscription": {...}
}
```

### Stripe Webhook
```
POST /webhook
(Handled by Stripe)
```

## Webhook Events Handled

- ✅ `customer.subscription.created` - New subscription
- ✅ `customer.subscription.updated` - Subscription changes
- ✅ `customer.subscription.deleted` - Cancellation
- ✅ `invoice.payment_succeeded` - Successful payment
- ✅ `invoice.payment_failed` - Failed payment

## Security Features

- ✅ Webhook signature verification
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ Supabase service role key (admin access)
- ✅ Stripe secret key protection

## Testing Stripe Integration

### Test Card Numbers

Use these in Stripe test mode:

- **Success:** `4242 4242 4242 4242`
- **Requires authentication:** `4000 0025 0000 3155`
- **Declined:** `4000 0000 0000 9995`

Any future expiry date and any 3-digit CVC.

### Test Webhook Locally

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Forward webhooks
stripe listen --forward-to localhost:3000/webhook

# Terminal 3: Trigger test event
stripe trigger customer.subscription.created
```

## Deployment

### Deploy to Railway/Render/Heroku

1. Push code to GitHub
2. Connect to deployment platform
3. Set environment variables
4. Deploy!
5. Update `FRONTEND_URL` in frontend to point to your backend URL

### Update Frontend

In `pathera-app/.env`:
```env
VITE_API_URL=https://your-backend-url.com
```

## Troubleshooting

### Webhook not working
- Check webhook secret is correct
- Verify endpoint URL is accessible
- Check Stripe CLI is running (for local dev)

### Payment not updating database
- Check Supabase service role key
- Verify webhook events are being received
- Check server logs for errors

### CORS errors
- Verify `FRONTEND_URL` matches your frontend
- Check CORS configuration in `server.js`

## Production Checklist

- [ ] Use production Stripe keys
- [ ] Set `NODE_ENV=production`
- [ ] Use production Supabase keys
- [ ] Configure production webhook endpoint
- [ ] Enable HTTPS
- [ ] Set secure CORS origins
- [ ] Monitor webhook delivery in Stripe dashboard
- [ ] Set up error logging (Sentry, LogRocket, etc.)
- [ ] Implement rate limiting
- [ ] Add request logging

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Documentation](https://expressjs.com/)
