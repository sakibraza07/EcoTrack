import axios from "axios"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
})

export const registerRequest = ({ email, password }) =>
  client.post("/auth/register", { email, password })

export const loginRequest = ({ email, password }) =>
  client.post("/auth/login", { email, password })

export const getDashboardSummary = (token) =>
  client.get("/dashboard/summary", {
    headers: { Authorization: `Bearer ${token}` },
  })

export const addActivity = (token, data) =>
  client.post("/activities/", data, {
    headers: { Authorization: `Bearer ${token}` },
  })
