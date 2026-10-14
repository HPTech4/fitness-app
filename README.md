# FitFlow 💪

A full-stack mobile fitness application built with React Native and Node.js. Track workouts, build streaks, monitor daily activity, and visualize progress over time.

[![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_57-000020?logo=expo)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---


## ✨ Features

### 🔐 Authentication
- Email/password registration with bcrypt hashing
- JWT-based session management (7-day tokens)
- Persistent login via AsyncStorage
- Automatic token attachment to API requests

### 🏋️ Workouts
- Browse a MongoDB-backed workout catalog
- Filter by category (Strength, Cardio, Mobility)
- Real-time search by title
- Detailed exercise breakdowns (sets, reps, duration, rest)
- Featured "Recommended" workout

### ⏱️ Workout Player
- Live countdown timer for time-based exercises
- Set/rep tracker with auto-advance
- Animated progress ring
- Exercise navigation (previous / next)
- Session logging with auto-computed calories and duration

### 📊 Stats & Progress
- Day / Week / Month views
- Interactive bar charts (calories burned)
- Weekly workout goal tracking
- Monthly averages
- Historical session data

### 🔥 Engagement
- Daily streak counter
- "Workout today" reminder banner
- 3-ring activity chart (steps, calories, active minutes)

### 📋 Personal Routines
- Create custom daily routines
- Toggle completion with optimistic UI
- Link routines to workouts
- Persistent across sessions

---

## 🏗️ Architecture
┌──────────────────────────────────────────────────────────┐
│ React Native (Expo) │
│ │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ Home │ │ Workouts │ │ Stats │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ React Navigation │ │
│ │ Tabs + Stack (nested) │ │
│ └─────────────────────────────────────────────────┘ │
│ │ │
│ ▼ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Axios Client + JWT Interceptor │ │
│ └─────────────────────────────────────────────────┘ │
└───────────────────────────┬───────────────────────────────┘
│ HTTPS
▼
┌──────────────────────────────────────────────────────────┐
│ Node.js + Express API │
│ │
│ /api/auth /api/workouts /api/sessions │
│ /api/stats /api/routines │
│ │
│ JWT Auth Middleware (protected) │
└───────────────────────────┬───────────────────────────────┘
│
▼
┌──────────────────────────────────────────────────────────┐
│ MongoDB Atlas │
│ │
│ users │ workouts │ workoutsessions │ dailystats │
└──────────────────────────────────────────────────────────┘

text

### **Data Model**

| Collection | Purpose | Key Fields |
|---|---|---|
| `users` | Auth + embedded routines | `email`, `password`, `routines[]` |
| `workouts` | Workout templates (shared) | `title`, `category`, `exercises[]` |
| `workoutsessions` | Logged workout completions | `user`, `workout`, `completedAt` |
| `dailystats` | Daily aggregated activity | `user`, `date`, `calories`, `steps` |

**Design decisions:**
- **Snapshot fields** in `workoutsessions` (e.g., `workoutTitle`) so history survives workout deletion
- **`dailyStats` pre-aggregated** for fast weekly/monthly queries
- **Compound unique index** on `(user, date)` in `dailystats` to prevent duplicates

---

## 🛠️ Tech Stack

### Frontend
| Package | Purpose |
|---|---|
| React Native (Expo SDK 57) | Cross-platform mobile framework |
| React Navigation v7 | Tabs + native stack |
| Axios | HTTP client with interceptors |
| AsyncStorage | Persistent token storage |
| react-native-svg | Custom charts (rings, bars) |
| Expo Vector Icons | Ionicons UI icons |

### Backend
| Package | Purpose |
|---|---|
| Node.js + Express | REST API |
| MongoDB + Mongoose | Data persistence |
| jsonwebtoken | JWT issuance/verification |
| bcryptjs | Password hashing |
| cors | Cross-origin requests |
| dotenv | Environment config |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+)
- A MongoDB Atlas cluster (free tier works)
- The [FitFlow backend](https://github.com/HPTech4/fitness-backend) running locally or deployed

### Installation

```bash
# Clone
git clone https://github.com/HPTech/fitness-app.git
cd fitness-app

# Install
npm install

# Configure API URL
# Edit api/client.js → set API_URL to your backend
Configuration
In api/client.js:

javascript
const API_URL = 'http://localhost:5000/api';

Run
bash
npx expo start
Then press:

w — Web

i — iOS Simulator (Mac only)

a — Android Emulator

Scan the QR with Expo Go for physical devices

📡 API Reference
Method	Endpoint	Auth	Description
POST	/api/auth/register	❌	Create account
POST	/api/auth/login	❌	Login
GET	/api/auth/me	✅	Current user profile
GET	/api/workouts	✅	List workouts (?category=)
GET	/api/workouts/:id	✅	Workout detail
POST	/api/sessions	✅	Log a completed workout
GET	/api/sessions	✅	Recent workout history
GET	/api/stats/today	✅	Today's stats
GET	/api/stats/weekly	✅	Last 7 days
GET	/api/stats/range?days=30	✅	Custom range (max 90 days)
GET	/api/stats/streak	✅	Current streak + today status
GET	/api/routines	✅	User's routines
POST	/api/routines	✅	Add routine
PATCH	/api/routines/:id/toggle	✅	Toggle completion
Full backend repo → fitness-backend

🗺️ Roadmap
✅ Shipped (v1)
☑ Full authentication flow
☑ Workout catalog + search + filters
☑ Live workout player with timer
☑ Session logging + stats aggregation
☑ Day / Week / Month analytics
☑ Custom routines
☑ Streak tracking

🚧 In Progress (v2)
□ Push notifications for routine reminders
□ Workout history screen
□ Custom goal setting (calories, steps, active minutes)
□ Achievements and badges

🔮 Planned (v3)
□ Real step tracking via pedometer
□ Apple Health / Google Fit integration
□ Social feed & friend challenges
□ AI-based workout recommendations
□ Dark mode

🐛 Known Issues
Day/Month stat filters do not yet support custom date ranges

Step count is currently static (pedometer integration planned)

Web build has minor layout differences vs native

🤝 Contributing
This is a personal portfolio project, but feedback and issues are welcome. Open an issue or submit a PR.

📄 License
MIT © [Alimi Azeez Opeyemi]

👤 Author
[Alimi Azeez Opeyemi]

GitHub: @HPTech4

LinkedIn: azeez-alimi-opeeyemi

Email: alimiazeez4@gmail.com



Built as a learning project to master full-stack React Native development