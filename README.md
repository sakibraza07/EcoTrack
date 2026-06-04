# 🌿 EcoTrack

> Track your carbon footprint. Make smarter choices. Help the planet.

EcoTrack is a full-stack web app that lets you log daily activities — transport, food, and electricity usage — and instantly see your carbon emissions with personalized eco-friendly recommendations.

🔗 **Live App:** [https://eco-track-mauve-alpha.vercel.app](https://eco-track-mauve-alpha.vercel.app)  
📡 **API Docs:** [https://ecotrack-87jw.onrender.com/docs](https://ecotrack-87jw.onrender.com/docs)

---

## ✨ Features

- 🔐 **User Authentication** — Secure register & login with JWT tokens
- 📝 **Activity Logging** — Log transport mode, distance, food type, and electricity usage
- ♻️ **Carbon Calculator** — Automatically calculates CO₂ emissions per activity across 3 categories
- 📊 **Dashboard** — View total activities, total carbon emitted, and average per entry
- 💡 **Smart Recommendations** — Personalized tips based on your highest-emission habits
- 🗄️ **Persistent Storage** — All data saved to MongoDB Atlas cloud database

---

## 🧮 How Carbon is Calculated

| Category | Formula |
|----------|---------|
| 🚗 Transport | `emission factor × distance (km)` |
| 🍽️ Food | Fixed score by diet type |
| ⚡ Electricity | `units × 0.82 kg CO₂/kWh` |

**Transport emission factors (kg CO₂/km):**
- Car → 0.21 &nbsp;|&nbsp; Bike → 0.12 &nbsp;|&nbsp; Bus → 0.08 &nbsp;|&nbsp; Train → 0.05 &nbsp;|&nbsp; Walking → 0

**Food emission scores (kg CO₂/day):**
- Non-vegetarian → 5 &nbsp;|&nbsp; Mixed → 3 &nbsp;|&nbsp; Vegetarian → 1.5

---

## 🚀 How to Use

1. **Register** a new account at the live app
2. **Log in** with your credentials
3. Click **"+ Log Activity"** on the dashboard
4. Fill in:
   - Transport mode & distance traveled
   - Food type for the day
   - Electricity units consumed
5. Hit **Submit** — your carbon score is calculated instantly
6. Check your **Dashboard** for stats and personalized recommendations

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | FastAPI, Python 3 |
| Database | MongoDB Atlas |
| Auth | JWT (python-jose) |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## 📁 Project Structure

```
EcoTrack/
├── Backend/
│   ├── main.py                      # FastAPI app entry point
│   ├── database.py                  # MongoDB Atlas connection
│   ├── models/
│   │   ├── user.py                  # User schema
│   │   └── activity.py              # Activity schema
│   ├── routes/
│   │   ├── auth.py                  # Register / Login / JWT
│   │   ├── activity.py              # Log & list activities
│   │   └── dashboard.py             # Stats & recommendations
│   ├── services/
│   │   ├── carbon_calculator.py     # Emission calculation logic
│   │   └── recommendation_engine.py # Eco tip generator
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   └── services/api.js          # Axios API calls
│   ├── package.json
│   └── .env.example
└── render.yaml                      # Render deployment config
```

---

## ⚙️ Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB Atlas account (free tier)

### 1. Clone the repo
```bash
git clone https://github.com/sakibraza07/EcoTrack.git
cd EcoTrack
```

### 2. Backend
```bash
cd Backend
cp .env.example .env
# Fill in MONGO_URI, MONGO_DB, SECRET_KEY in .env
pip install -r requirements.txt
uvicorn main:app --reload
# Runs at http://127.0.0.1:8000
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env
# Set VITE_API_BASE_URL=http://127.0.0.1:8000
npm install
npm run dev
# Runs at http://localhost:5173
```

### Environment Variables

**Backend `.env`:**
```
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/
MONGO_DB=ecotrack
SECRET_KEY=your-secret-key
PORT=8000
```

**Frontend `.env`:**
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## 🌍 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://eco-track-mauve-alpha.vercel.app |
| Backend | Render | https://ecotrack-87jw.onrender.com |

> ⚠️ The backend is on Render's free tier — it may take 30-50 seconds to wake up after inactivity.

---

## 🔭 Future Scope

- 📅 **Weekly & Monthly Reports** — Charts showing emission trends over time
- 🏆 **Leaderboard** — Compare your carbon score with other users
- 🌱 **Carbon Offset Tracker** — Log eco-positive actions like tree planting
- 📱 **Mobile App** — React Native version for on-the-go logging
- 🔔 **Daily Reminders** — Push notifications to log activities
- 🌐 **Multi-language Support** — Reach a global audience
- 🤖 **AI Recommendations** — Smarter tips powered by usage patterns
- 📤 **Export Reports** — Download your carbon data as PDF or CSV

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use and modify.

---

<p align="center">Made with 💚 to help the planet</p>
