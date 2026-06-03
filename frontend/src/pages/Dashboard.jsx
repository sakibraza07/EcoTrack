import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getDashboardSummary, addActivity } from "../services/api"

const TRANSPORT_OPTIONS = ["car", "bike", "bus", "train", "walking"]
const FOOD_OPTIONS = ["vegetarian", "mixed", "nonvegetarian"]
const TRANSPORT_ICONS = { car: "🚗", bike: "🚲", bus: "🚌", train: "🚆", walking: "🚶" }
const FOOD_ICONS = { vegetarian: "🥦", mixed: "🍽️", nonvegetarian: "🥩" }

const defaultForm = { activity_type: "weekly check-in", transport: "car", distance: "", food: "mixed", electricity: "" }

function Dashboard() {
  const navigate = useNavigate()
  const [userEmail] = useState(localStorage.getItem("ecotrack-user") || "")
  const [summary, setSummary] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [activities, setActivities] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [formError, setFormError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const token = localStorage.getItem("ecotrack-token")

  const loadSummary = async () => {
    setError("")
    try {
      const res = await getDashboardSummary(token)
      setSummary(res.data.summary)
      setRecommendations(res.data.recommendations)
      setActivities(res.data.recent_activities)
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load dashboard data.")
      if (err.response?.status === 401) {
        localStorage.removeItem("ecotrack-token")
        localStorage.removeItem("ecotrack-user")
        navigate("/")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (!token) { navigate("/"); return } loadSummary() }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("ecotrack-token")
    localStorage.removeItem("ecotrack-user")
    navigate("/")
  }

  const handleFormChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleAddActivity = async (e) => {
    e.preventDefault()
    setFormError("")
    setSuccessMsg("")
    const distance = parseFloat(form.distance)
    const electricity = parseFloat(form.electricity)
    if (!form.activity_type.trim()) { setFormError("Activity type is required."); return }
    if (isNaN(distance) || distance < 0) { setFormError("Enter a valid distance (≥ 0)."); return }
    if (isNaN(electricity) || electricity < 0) { setFormError("Enter valid electricity usage (≥ 0)."); return }
    setSubmitting(true)
    try {
      await addActivity(token, { activity_type: form.activity_type.trim(), transport: form.transport, distance, food: form.food, electricity })
      setForm(defaultForm)
      setShowForm(false)
      setSuccessMsg("Activity logged successfully!")
      setLoading(true)
      await loadSummary()
    } catch (err) {
      setFormError(err.response?.data?.detail || "Failed to log activity.")
    } finally {
      setSubmitting(false)
    }
  }

  const avatarLetter = userEmail ? userEmail[0].toUpperCase() : "U"

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>
          <span style={{ fontSize: "22px" }}>🌿</span>
          <span style={s.sidebarLogoText}>EcoTrack</span>
        </div>
        <nav style={s.nav}>
          <div style={s.navItem}>
            <span style={{ fontSize: "18px" }}>📊</span> Dashboard
          </div>
        </nav>
        <div style={s.sidebarFooter}>
          <div style={s.avatar}>{avatarLetter}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={s.avatarEmail}>{userEmail}</div>
          </div>
          <button onClick={handleLogout} style={s.logoutBtn} title="Logout">↩</button>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        {/* Top bar */}
        <div style={s.topbar}>
          <div>
            <h1 style={s.pageTitle}>Dashboard</h1>
            <p style={s.pageSubtitle}>Track and reduce your carbon footprint</p>
          </div>
          <button onClick={() => { setShowForm(v => !v); setFormError(""); setSuccessMsg("") }} style={s.addBtn}>
            {showForm ? "✕ Cancel" : "+ Log Activity"}
          </button>
        </div>

        {successMsg && (
          <div style={s.successBanner}>✅ {successMsg}</div>
        )}

        {/* Log Activity Form */}
        {showForm && (
          <div style={s.formCard}>
            <h2 style={s.formTitle}>Log New Activity</h2>
            <form onSubmit={handleAddActivity} style={s.formGrid}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Activity Label</label>
                <input name="activity_type" value={form.activity_type} onChange={handleFormChange}
                  placeholder="e.g. weekly check-in" style={s.input} />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Transport Mode</label>
                <select name="transport" value={form.transport} onChange={handleFormChange} style={s.select}>
                  {TRANSPORT_OPTIONS.map(t => (
                    <option key={t} value={t}>{TRANSPORT_ICONS[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Distance (km)</label>
                <input name="distance" type="number" min="0" step="0.1" value={form.distance}
                  onChange={handleFormChange} placeholder="e.g. 15" style={s.input} />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Food Type</label>
                <select name="food" value={form.food} onChange={handleFormChange} style={s.select}>
                  {FOOD_OPTIONS.map(f => (
                    <option key={f} value={f}>{FOOD_ICONS[f]} {f.charAt(0).toUpperCase() + f.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div style={{ ...s.fieldGroup, gridColumn: "1 / -1" }}>
                <label style={s.label}>Electricity Usage (kWh)</label>
                <input name="electricity" type="number" min="0" step="0.1" value={form.electricity}
                  onChange={handleFormChange} placeholder="e.g. 12" style={s.input} />
              </div>
              {formError && <div style={{ ...s.errorBox, gridColumn: "1 / -1" }}>{formError}</div>}
              <div style={{ gridColumn: "1 / -1" }}>
                <button type="submit" disabled={submitting} style={{
                  ...s.addBtn, width: "100%", justifyContent: "center",
                  opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer"
                }}>
                  {submitting ? "Logging…" : "✓ Log Activity"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        {loading ? (
          <div style={s.loadingBox}>Loading your data…</div>
        ) : error ? (
          <div style={s.errorBox}>{error}</div>
        ) : (
          <>
            <div style={s.statsGrid}>
              <div style={{ ...s.statCard, borderTop: "3px solid #1a7a45" }}>
                <div style={s.statLabel}>Total Activities</div>
                <div style={{ ...s.statValue, color: "#1a7a45" }}>{summary?.total_activities ?? 0}</div>
                <div style={s.statHint}>logged entries</div>
              </div>
              <div style={{ ...s.statCard, borderTop: "3px solid #e67e22" }}>
                <div style={s.statLabel}>Total Carbon</div>
                <div style={{ ...s.statValue, color: "#e67e22" }}>{summary?.total_carbon ?? 0}</div>
                <div style={s.statHint}>kg CO₂ emitted</div>
              </div>
              <div style={{ ...s.statCard, borderTop: "3px solid #3498db" }}>
                <div style={s.statLabel}>Average Carbon</div>
                <div style={{ ...s.statValue, color: "#3498db" }}>{summary?.average_carbon ?? 0}</div>
                <div style={s.statHint}>kg CO₂ per entry</div>
              </div>
            </div>

            <div style={s.twoCol}>
              {/* Recommendations */}
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.cardIcon}>💡</span>
                  <h2 style={s.cardTitle}>Recommendations</h2>
                </div>
                <div style={s.tipsList}>
                  {recommendations.length ? recommendations.map((tip, i) => (
                    <div key={i} style={s.tipItem}>
                      <span style={s.tipDot}></span>
                      <span style={s.tipText}>{tip}</span>
                    </div>
                  )) : (
                    <div style={s.emptyMsg}>No recommendations yet — keep tracking!</div>
                  )}
                </div>
              </div>

              {/* Recent Activities */}
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.cardIcon}>📋</span>
                  <h2 style={s.cardTitle}>Recent Activities</h2>
                </div>
                {activities.length ? (
                  <div style={s.activityList}>
                    {activities.slice(-5).reverse().map(a => (
                      <div key={a.id} style={s.activityItem}>
                        <div style={s.activityLeft}>
                          <span style={s.activityEmoji}>{TRANSPORT_ICONS[a.transport] || "🌍"}</span>
                          <div>
                            <div style={s.activityName}>{a.activity_type}</div>
                            <div style={s.activityMeta}>
                              {a.transport} · {a.distance}km · {a.food} · {a.electricity}kWh
                            </div>
                          </div>
                        </div>
                        <div style={s.activityCarbon}>
                          <span style={s.carbonValue}>{a.carbon.total}</span>
                          <span style={s.carbonUnit}>kg CO₂</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={s.emptyMsg}>No activities yet — log your first one!</div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

const s = {
  page: {
    display: "flex", minHeight: "100vh",
    background: "#f4f6f4", fontFamily: "system-ui, -apple-system, sans-serif",
  },
  sidebar: {
    width: "240px", flexShrink: 0, background: "#0f4c2a",
    display: "flex", flexDirection: "column",
    padding: "1.5rem 1rem", position: "sticky", top: 0, height: "100vh",
  },
  sidebarLogo: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "2.5rem", paddingLeft: "4px" },
  sidebarLogoText: { color: "#fff", fontSize: "20px", fontWeight: "700", letterSpacing: "-0.5px" },
  nav: { flex: 1 },
  navItem: {
    display: "flex", alignItems: "center", gap: "10px",
    color: "#fff", fontSize: "14px", fontWeight: "500",
    padding: "10px 12px", borderRadius: "10px",
    background: "rgba(255,255,255,0.12)",
  },
  sidebarFooter: {
    display: "flex", alignItems: "center", gap: "10px",
    borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "1rem",
  },
  avatar: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "rgba(255,255,255,0.2)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "15px", fontWeight: "600", flexShrink: 0,
  },
  avatarEmail: {
    color: "rgba(255,255,255,0.75)", fontSize: "12px",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  logoutBtn: {
    background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
    borderRadius: "8px", width: "30px", height: "30px",
    cursor: "pointer", fontSize: "16px", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  main: { flex: 1, padding: "2rem", overflowY: "auto" },
  topbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: "1.75rem",
  },
  pageTitle: { fontSize: "24px", fontWeight: "700", color: "#111", margin: "0 0 4px", letterSpacing: "-0.5px" },
  pageSubtitle: { fontSize: "14px", color: "#777", margin: 0 },
  addBtn: {
    padding: "10px 20px", borderRadius: "10px", border: "none",
    background: "linear-gradient(135deg, #1a7a45, #0f4c2a)",
    color: "#fff", fontSize: "14px", fontWeight: "600",
    cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
    fontFamily: "inherit",
  },
  successBanner: {
    background: "#edfaf3", border: "1px solid #a8e6c0", borderRadius: "12px",
    padding: "12px 16px", fontSize: "14px", color: "#1a7a45",
    marginBottom: "1.25rem", fontWeight: "500",
  },
  formCard: {
    background: "#fff", borderRadius: "16px", padding: "1.75rem",
    marginBottom: "1.75rem", border: "1px solid #e8ede8",
  },
  formTitle: { fontSize: "17px", fontWeight: "600", color: "#111", margin: "0 0 1.25rem" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#555", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: {
    padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #e0e0e0",
    fontSize: "14px", color: "#111", outline: "none", fontFamily: "inherit",
  },
  select: {
    padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #e0e0e0",
    fontSize: "14px", color: "#111", outline: "none", background: "#fff",
    fontFamily: "inherit",
  },
  errorBox: {
    background: "#fff1f0", border: "1px solid #ffc9c9", borderRadius: "10px",
    padding: "10px 12px", fontSize: "13px", color: "#c0392b",
  },
  loadingBox: {
    background: "#fff", borderRadius: "16px", padding: "2rem",
    textAlign: "center", color: "#888", fontSize: "15px",
  },
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem", marginBottom: "1.5rem",
  },
  statCard: {
    background: "#fff", borderRadius: "14px", padding: "1.25rem 1.5rem",
    border: "1px solid #e8ede8",
  },
  statLabel: { fontSize: "12px", fontWeight: "600", color: "#999", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" },
  statValue: { fontSize: "36px", fontWeight: "700", lineHeight: 1, marginBottom: "4px", letterSpacing: "-1px" },
  statHint: { fontSize: "12px", color: "#aaa" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  card: {
    background: "#fff", borderRadius: "14px", padding: "1.25rem 1.5rem",
    border: "1px solid #e8ede8",
  },
  cardHeader: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" },
  cardIcon: { fontSize: "18px" },
  cardTitle: { fontSize: "15px", fontWeight: "600", color: "#111", margin: 0 },
  tipsList: { display: "flex", flexDirection: "column", gap: "10px" },
  tipItem: { display: "flex", alignItems: "flex-start", gap: "10px" },
  tipDot: {
    width: "8px", height: "8px", borderRadius: "50%", background: "#1a7a45",
    flexShrink: 0, marginTop: "6px",
  },
  tipText: { fontSize: "14px", color: "#444", lineHeight: 1.5 },
  emptyMsg: { fontSize: "14px", color: "#aaa", textAlign: "center", padding: "1rem 0" },
  activityList: { display: "flex", flexDirection: "column", gap: "10px" },
  activityItem: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 12px", borderRadius: "10px", background: "#f8faf8",
    border: "1px solid #eef2ee",
  },
  activityLeft: { display: "flex", alignItems: "center", gap: "10px" },
  activityEmoji: { fontSize: "20px" },
  activityName: { fontSize: "13px", fontWeight: "600", color: "#111", marginBottom: "2px" },
  activityMeta: { fontSize: "12px", color: "#888" },
  activityCarbon: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
  carbonValue: { fontSize: "15px", fontWeight: "700", color: "#e67e22" },
  carbonUnit: { fontSize: "11px", color: "#aaa" },
}

export default Dashboard
