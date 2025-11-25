

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import './Login.css';





function Login({ setIsLoggedIn, setUserRole }) {
    const navigate = useNavigate();
    // Form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    // UI & async state
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("info");
    const [requires2FA, setRequires2FA] = useState(false);
    const [twoFACode, setTwoFACode] = useState("");
    const [lockoutSeconds, setLockoutSeconds] = useState(0);
    const attemptsRef = useRef(0);


    useEffect(() => {
        if (!lockoutSeconds) return;
        const t = setInterval(() => {
            setLockoutSeconds((s) => {
                if (s <= 1) {
                    attemptsRef.current = 0;
                    clearInterval(t);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [lockoutSeconds]);

    // Basic validators
    const validateEmail = (e) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

    const passwordStrength = (pw) => {
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return Math.min(4, score);
    };

    const pwStrengthLabel = (score) => {
        switch (score) {
            case 0: return { label: "Too short", color: "#ff6b6b", width: "6%" };
            case 1: return { label: "Weak", color: "#ff753a", width: "35%" };
            case 2: return { label: "Fair", color: "#ffb545", width: "60%" };
        };
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e?.preventDefault();
        setMessage(null);
        if (lockoutSeconds > 0) {
            setMessageType("error");
            setMessage(`Too many failed attempts. Try again in ${lockoutSeconds}s.`);
            return;
        }

        if (!validateEmail(email)) {
            setMessageType("error");
            setMessage("Please enter a valid email address.");
            return;
        }
        if (password.length < 8) {
            setMessageType("error");
            setMessage("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);
        try {
            // Replace endpoint with your real auth endpoint
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, remember }),
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                // success path
                setMessageType("success");
                setMessage("Login successful. Redirecting...");
                setRequires2FA(false);

                // Determine role based on email for testing, or response data
                const role = email.includes('admin') ? 'admin' : 'student';
                setIsLoggedIn(true);
                setUserRole(role);

                // optionally redirect or set auth state:
                setTimeout(() => {
                    if (role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/student');
                    }
                    setMessage("Ready.");
                }, 800);
            } else {
                // server can indicate 2FA required or other info
                if (data?.requires2FA) {
                    setRequires2FA(true);
                    setMessageType("info");
                    setMessage("Two-factor authentication required. Enter your code.");
                } else {
                    // generic error handling
                    attemptsRef.current += 1;
                    if (attemptsRef.current >= 5) {
                        setLockoutSeconds(30); // lockout for 30 seconds
                        setMessageType("error");
                        setMessage("Too many failed attempts. Temporarily locked out for 30s.");
                    } else {
                        setMessageType("error");
                        setMessage(data?.message || "Invalid credentials. Check your email/password.");
                    }
                }
            }
        } catch (err) {
            setMessageType("error");
            setMessage("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle 2FA verification
    const handle2FAVerify = async (e) => {
        e?.preventDefault();
        if (!twoFACode.trim()) {
            setMessageType("error");
            setMessage("Enter the 2FA code.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/verify-2fa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: twoFACode }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setMessageType("success");
                setMessage("Authentication complete. Redirecting...");
                setRequires2FA(false);
                setTimeout(() => {
                    // window.location.replace('/dashboard');
                    setMessage("Ready.");
                }, 800);
            } else {
                setMessageType("error");
                setMessage(data?.message || "Invalid 2FA code.");
            }
        } catch {
            setMessageType("error");
            setMessage("Network error during 2FA verification.");
        } finally {
            setLoading(false);
        }
    };

    const pws = passwordStrength(password);
    const pwsMeta = pwStrengthLabel(pws);

    return (
        <div className="login-wrap" role="main">
            <div className="card" aria-live="polite">
                <div className="left">
                    <div className="brand">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <rect width="24" height="24" rx="6" fill="#0077CC" />
                            <path d="M6 14c1-2 4-4 6-4s5 2 6 4" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Swimming School
                    </div>
                    <div className="hero">Welcome back — sign in to manage classes, members and schedules.</div>
                    <div className="features">
                        <div className="muted">Secure authentication with optional 2FA</div>
                        <div className="muted">Manage schedules, track progress, accept payments</div>
                        <div className="muted">Mobile-friendly dashboard</div>
                    </div>
                </div>

                <div className="right">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>Sign in</div>
                        <div className="muted">New? <a href="/signup" className="hint-link">Create account</a></div>
                    </div>

                    {message && (
                        <div className={messageType === "error" ? "error" : messageType === "success" ? "success" : "hint"}>
                            {message}
                        </div>
                    )}

                    {!requires2FA ? (
                        <form onSubmit={handleSubmit} aria-label="Login form">
                            <div>
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@domain.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                {!validateEmail(email) && email.length > 0 && <div className="error">Invalid email format</div>}
                            </div>

                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <label htmlFor="password">Password</label>
                                    <div style={{ fontSize: 12 }} className="muted">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((s) => !s)}
                                            style={{ background: "transparent", border: 0, color: "#065a8d", cursor: "pointer", padding: 0 }}
                                            aria-pressed={showPassword}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                                    <div style={{ flex: 1 }}>
                                        <div className="pw-meter" aria-hidden>
                                            <div
                                                className="pw-fill"
                                                style={{ width: pwsMeta.width, background: pwsMeta.color }}
                                            />
                                        </div>
                                        <div className="small" style={{ marginTop: 6 }}>{pwsMeta.label}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                                    <span className="small">Remember me</span>
                                </label>
                                <div>
                                    <button type="button" className="hint-link" onClick={() => alert("Password reset flow")}>Forgot password?</button>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={loading}
                                    aria-disabled={loading}
                                >
                                    {loading ? <span className="spinner" aria-hidden /> : "Sign in"}
                                </button>
                                <button type="button" className="btn btn-ghost" onClick={() => { setEmail(""); setPassword(""); }}>
                                    Reset
                                </button>
                            </div>

                            <div className="divider" />

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div className="muted">Or sign in with</div>
                                <div className="socials">
                                    <button aria-label="Sign in with Google" className="btn btn-ghost" onClick={() => handleSocial("google")}>Google</button>
                                    <button aria-label="Sign in with Facebook" className="btn btn-ghost" onClick={() => handleSocial("facebook")}>Facebook</button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handle2FAVerify}>
                            <div>
                                <label htmlFor="2fa">Two-factor code</label>
                                <input
                                    id="2fa"
                                    name="2fa"
                                    type="number"
                                    inputMode="numeric"
                                    placeholder="123456"
                                    value={twoFACode}
                                    onChange={(e) => setTwoFACode(e.target.value)}
                                    required
                                />
                                <div className="small">Enter the code from your authenticator or SMS.</div>
                            </div>

                            <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                                <button className="btn btn-primary" type="submit" disabled={loading}>
                                    {loading ? <span className="spinner" aria-hidden /> : "Verify"}
                                </button>
                                <button type="button" className="btn btn-ghost" onClick={() => { setRequires2FA(false); setTwoFACode(""); }}>
                                    Back
                                </button>
                            </div>
                        </form>
                    )}

                    <div style={{ marginTop: 8 }} className="small">
                        By signing in you agree to the <span className="hint-link" onClick={() => alert('TOS')}>Terms</span>.
                    </div>
                </div>
            </div>
        </div>
    );
}



export default Login;