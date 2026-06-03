# 🌿 EcoTrack

A full-stack carbon footprint tracking app built with **React + Vite** (frontend) and **FastAPI + MongoDB Atlas** (backend).

---

## 📁 Project Structure

```
EcoTrack/
├── Backend/          # FastAPI Python backend
│   ├── main.py
│   ├── database.py
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── requirements.txt
│   └── .env.example
├── frontend/         # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
└── render.yaml       # Deployment config for Render
```

---

## ⚙️ Setup

### 1. MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free cluster
2. Create a database user (username + password)
3. Whitelist your IP (or use `0.0.0.0/0` for all IPs during dev)
4. Copy your connection string: `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/`

### 2. Backend

```bash
cd Backend
cp .env.example .env
# Edit .env and paste your MONGO_URI
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env — set VITE_API_BASE_URL to your backend URL
npm install
npm run dev
```

---

## 🚀 Deployment (Render)

1. Push this repo to GitHub
2. Go to [Render](https://render.com) → New → Blueprint
3. Connect your GitHub repo — Render will read `render.yaml` automatically
4. In the **ecotrack-backend** service → Environment → add `MONGO_URI`
5. Deploy backend first, copy its URL, then set `VITE_API_BASE_URL` in frontend service
6. Done! 🎉

---

## 🛠 Tech Stack

| Layer    | Technology               |
|----------|--------------------------|
| Frontend | React 19, Vite, Tailwind |
| Backend  | FastAPI, Python          |
| Database | MongoDB Atlas            |
| Deploy   | Render                   |
