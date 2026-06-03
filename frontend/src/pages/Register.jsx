import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerRequest } from "../services/api"

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    if (!email.trim() || !password) { setError("Email and password are required."); return }
    if (!validateEmail(email.trim())) { setError("Enter a valid email address."); return }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return }
    setSubmitting(true)
    try {
      await registerRequest({ email: email.trim(), password })
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>🌿</div>
          <span style={styles.logoText}>EcoTrack</span>
        </div>
        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.subheading}>Start monitoring your carbon impact today</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" style={styles.input} />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters" style={styles.input} />
          </div>
          {error && <div style={styles.errorBox}>{error}</div>}
          <button type="submit" disabled={submitting} style={{
            ...styles.primaryBtn, opacity: submitting ? 0.7 : 1,
            cursor: submitting ? "not-allowed" : "pointer"
          }}>
            {submitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <button onClick={() => navigate("/")} style={styles.linkBtn}>Sign in</button>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f4c2a 0%, #1a7a45 50%, #0d3d22 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "1rem", fontFamily: "system-ui, -apple-system, sans-serif",
  },
  card: {
    background: "#fff", borderRadius: "24px", padding: "2.5rem",
    width: "100%", maxWidth: "420px", boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
  },
  logoRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" },
  logoIcon: { fontSize: "28px" },
  logoText: { fontSize: "22px", fontWeight: "700", color: "#0f4c2a", letterSpacing: "-0.5px" },
  heading: { fontSize: "26px", fontWeight: "700", color: "#111", margin: "0 0 6px", letterSpacing: "-0.5px" },
  subheading: { fontSize: "15px", color: "#666", margin: "0 0 2rem" },
  form: { display: "flex", flexDirection: "column", gap: "1.25rem" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#444", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: {
    padding: "12px 14px", borderRadius: "12px", border: "1.5px solid #e5e5e5",
    fontSize: "15px", color: "#111", outline: "none", fontFamily: "inherit",
  },
  errorBox: {
    background: "#fff1f0", border: "1px solid #ffc9c9", borderRadius: "10px",
    padding: "12px 14px", fontSize: "14px", color: "#c0392b",
  },
  primaryBtn: {
    padding: "14px", borderRadius: "12px", border: "none",
    background: "linear-gradient(135deg, #1a7a45, #0f4c2a)",
    color: "#fff", fontSize: "16px", fontWeight: "600",
    fontFamily: "inherit", letterSpacing: "0.2px",
  },
  switchText: { textAlign: "center", fontSize: "14px", color: "#888", marginTop: "1.5rem", marginBottom: 0 },
  linkBtn: {
    background: "none", border: "none", color: "#1a7a45", fontWeight: "600",
    cursor: "pointer", fontSize: "14px", padding: 0, fontFamily: "inherit",
  },
}

export default Register
