# Shri Shivshakti Car Bazar — Frontend

A pre-owned car marketplace platform built for **Shri Shivshakti Car Bazar**, a family-run dealership business. The platform lists used cars for browsing, searching, and filtering, helping build a direct relationship between buyers and the dealer. Users can explore vehicle details, filter cars based on their preferences, and contact the owner directly for inquiries.

🔗 **Live Demo:** [shiv-shakti-car-frontend-staging-lovat.vercel.app](https://shiv-shakti-car-frontend-staging-lovat.vercel.app/)
🔗 **Backend Repo:** [shiv-shakti-car-Backend](https://github.com/yashtalele09/shiv-shakti-car-Backend)

---

## ✨ Features

### Authentication
- Sign in / Sign up
- Email verification
- Forget password flow
- Firebase authentication via Google

### Core Marketplace
- Browse pre-owned cars
- Search and advanced vehicle filtering (personalized results based on user preference)
- Like / favorite vehicles
- Vehicle details page
- Vehicle inquiry system (contact the owner directly)
- Featured vehicle section
- Vehicle image gallery
- Service section
- Review section — users can add reviews

### User Experience
- Responsive design for mobile, tablet, and desktop
- User profile and dashboard
- Optimized API data fetching and caching
- Vehicle and page interaction tracking

---

## 🛠️ Tech Stack

### Frontend
- React (TypeScript)
- Tailwind CSS
- Zustand
- TanStack Query
- React Router
- Framer Motion
- Lucide React
- Zod
- JWT
- Axios
- npm
- React Toastify

### Authentication & Services
- Firebase
- Resend (email)
- Redis
- Cloudinary

### Deployment
- Vercel

---

## 📁 Project Structure

```
src/
├── assets/
├── components/
├── constants/
├── helper/
├── hooks/
├── layout/
├── lib/
├── pages/
├── store/
├── stores/
├── types/
├── utils/
├── validations/
├── App.tsx
├── axios.ts
├── index.css
├── main.tsx
└── routes.tsx
```

---

## 🚀 Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/yashtalele09/shiv-shakti-car-frontend.git
```

**2. Navigate to the project**

```bash
cd shiv-shakti-car-frontend
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env` file in the root directory:

```
VITE_APP_API_URL=https://shiv-shakti-car-backend-staging.onrender.com
```

Add any other required environment variables used by the project.

**5. Start the development server**

```bash
npm run dev
```

The application will run locally using the Vite development server.

---

## 🏗️ Build for Production

```bash
npm run build
```

---

## 🔄 Application Flow

```
User
  │
  ▼
React Frontend
  │
  ├── Authentication ──► Firebase
  │
  ├── API Requests ────► Node.js / Express Backend
  │                          │
  │                          ▼
  │                      MongoDB
  │
  ├── Images ──────────► Cloudinary
  │
  └── Email Services ──► Resend
```

---

## 📱 Responsive Design

The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile devices

with custom hooks handling responsive behavior.

---

## 🚀 Deployment

The frontend is deployed using **Vercel**. Production deployment is connected to the GitHub repository, allowing changes to be deployed through the CI/CD workflow.

---

## 👤 Author

**Yash Talele**
B.Tech Computer Science Engineer

- GitHub: [github.com/yashtalele09](https://github.com/yashtalele09)
- LinkedIn: [linkedin.com/in/yash-talele-0665b722b](https://www.linkedin.com/in/yash-talele-0665b722b/)

---

## 📄 License

This project is proprietary and built for Shri Shivshakti Car Bazar.
