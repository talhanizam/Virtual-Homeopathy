# Virtual Homeopathy - Dr. Reshma Nizam

A modern e-commerce platform for homeopathy ebooks and educational content by Dr. Reshma Nizam.

## Features

- 📚 **Ebook Store** - Browse and purchase homeopathy ebooks
- 🎥 **Video Content** - Educational YouTube videos
- 💳 **Secure Payments** - Razorpay integration for Indian payments
- 🔐 **User Authentication** - Supabase-powered auth system
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Performance Optimized** - Next.js 15 with Turbopack

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Razorpay
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- Razorpay account

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application requires the following Supabase tables:

- `ebooks` - Store ebook information
- `orders` - Payment orders
- `purchases` - User purchases
- `payments` - Payment webhook logs

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Production Checklist

- ✅ Environment variables configured
- ✅ Database migrations applied
- ✅ Razorpay webhooks configured
- ✅ Domain and SSL certificate
- ✅ Analytics tracking setup
- ✅ Error monitoring configured
- ✅ Backup strategy implemented

## Support

For technical support or questions about the platform, please contact the development team.

## License

This project is proprietary software for Virtual Homeopathy.
