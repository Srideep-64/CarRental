# Car Rental Application
 
A full-stack car rental marketplace where car owners can list vehicles and renters can search, filter, and book them by date range. Built on the MERN stack with JWT-based role auth (renter vs. owner) and ImageKit for optimized image delivery.
 
## Live Demo
- **Frontend:** car-rental-gamma-liard.vercel.app
- **Backend API:** car-rental-server-coral-two.vercel.app
## Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, Axios, React Context |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM), hosted on MongoDB Atlas |
| Auth | JWT (JSON Web Tokens), bcrypt for password hashing |
| Image Storage | ImageKit (CDN + on-the-fly transformations) |
| Deployment | Vercel (client + server) |
 
## Features
 
- **Two user roles in one model** — `role: "user" | "owner"`, checked via middleware rather than separate collections.
- **Browse & filter cars** by location and date range.
- **Booking flow** with date-range selection and real-time availability checking.
- **Owner dashboard** — add/edit/delete cars, manage incoming bookings, view stats.
- **Image upload pipeline** — Multer (memory storage) → ImageKit upload → CDN URL with transformations (`width`, `quality`, `format`) stored on the Car document.
- **Concurrency-safe booking** — prevents two users from double-booking the same car for overlapping dates (see below).
- **Self-booking restriction** — an owner cannot book their own car.
## Project Structure
 
```
server/
├── configs/
│   ├── db.js              # MongoDB connection
│   └── imageKit.js        # ImageKit client config
├── controllers/
│   ├── authController.js
│   ├── bookingController.js
│   ├── carController.js
│   └── ownerController.js
├── middleware/
│   ├── auth.js            # JWT verification (protect)
│   └── multer.js          # in-memory file upload handling
├── models/
│   ├── User.js
│   ├── Car.js
│   ├── Booking.js
│   └── BookingLock.js     # concurrency lock 
├── routes/
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   ├── carRoutes.js
│   └── ownerRoutes.js
└── server.js
 
client/
├── src/
│   ├── components/        # Navbar, Footer, CarCard, Loader, etc.
│   ├── pages/              # Home, CarDetails, MyBookings, Owner pages
│   ├── context/            # global state (auth/user, currency, cars)
│   └── assets/
```
 
## Core Data Models
 
**User**: `name`, `email`, `password` (hashed), `role`, `image`
**Car**: `owner` (ref User), `brand`, `model`, `year`, `category`, `pricePerDay`, `location`, `image`, `isAvailable`
**Booking**: `car` (ref Car), `user` (ref User), `owner` (ref User), `pickupDate`, `returnDate`, `status` (`pending` / `confirmed` / `cancelled`), `price`
**BookingLock**: `car` (unique) — short-lived lock document used only during booking creation
 
## Environment Variables
 
Server `.env` :
 
```
MONGODB_URI=
JWT_SECRET=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```
 
## API Routes
 
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| POST | `/api/bookings/check-availability` | — | Check available cars for a location/date range |
| POST | `/api/bookings/create` | ✅ | Create a booking (concurrency-safe) |
| GET | `/api/bookings/user` | ✅ | Get logged-in user's bookings |
| GET | `/api/bookings/owner` | ✅ (owner) | Get bookings for an owner's cars |
| POST | `/api/bookings/change-status` | ✅ (owner) | Confirm/cancel a booking |
| POST | `/api/owner/add-car` | ✅ (owner) | Add a new car with image upload |
 
