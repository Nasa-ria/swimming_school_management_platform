import React, { useState } from "react";
// const baseUrl = process.env.REACT_APP_BASE_URL;

const initialState = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    agree: false,
};

const genders = ["Male", "Female", "Other"];

function SignUp() {
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);


    const validate = () => {
        const newErrors = {};
        if (!form.fullName?.trim()) newErrors.fullName = "Full name is required";
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
            newErrors.email = "Valid email is required";
        if (!form.password || form.password.length < 8)
            newErrors.password = "Password must be at least 8 characters";
        if (form.password !== form.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";
        if (!form.phone || !/^\d{10,}$/.test(form.phone))
            newErrors.phone = "Valid phone number is required";
        if (!form.dob) newErrors.dob = "Date of birth is required";
        if (!form.gender) newErrors.gender = "Gender is required";
        if (!form.address?.trim()) newErrors.address = "Address is required";
        if (!form.agree) newErrors.agree = "You must agree to terms";
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName: form.fullName,
                        email: form.email,
                        password: form.password,
                        phone: form.phone,
                        role: 'student' // Default role for signup
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    setSubmitted(true);
                    setForm(initialState);
                    // Optionally store token and redirect
                    if (data.token) {
                        localStorage.setItem('authToken', data.token);
                        // Redirect to dashboard after 2 seconds
                        setTimeout(() => {
                            window.location.href = '/student';
                        }, 2000);
                    }
                } else {
                    setErrors({ submit: data.message || 'Registration failed. Please try again.' });
                }
            } catch (error) {
                console.error('Registration error:', error);
                setErrors({ submit: 'Network error. Please check your connection and try again.' });
            } finally {
                setLoading(false);
            }
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "10px",
        marginTop: "6px",
        marginBottom: "12px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "14px",
    };

    return (
        <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, boxShadow: "0 2px 8px #ccc", borderRadius: 8, fontFamily: "Arial, sans-serif" }}>
            <h2>Create Account</h2>
            {submitted ? (
                <div style={{ color: "#4caf50", marginBottom: 16, padding: "12px", backgroundColor: "#f1f8f4", borderRadius: "4px" }}>
                    ✓ Registration successful!
                </div>
            ) : (
                <form onSubmit={handleSubmit} noValidate>
                    {errors.submit && <div style={{ color: "#f44336", marginBottom: 12 }}>{errors.submit}</div>}

                    <div>
                        <label style={{ fontWeight: "500" }}>Full Name *</label>
                        <input type="text" name="fullName" value={form.fullName} onChange={handleChange} style={inputStyle} />
                        {errors.fullName && <div style={{ color: "#f44336", fontSize: "12px" }}>• {errors.fullName}</div>}
                    </div>

                    <div>
                        <label style={{ fontWeight: "500" }}>Email *</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle} />
                        {errors.email && <div style={{ color: "#f44336", fontSize: "12px" }}>• {errors.email}</div>}
                    </div>

                    <div>
                        <label style={{ fontWeight: "500" }}>Password (min 6 characters) *</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} style={inputStyle} />
                        {errors.password && <div style={{ color: "#f44336", fontSize: "12px" }}>• {errors.password}</div>}
                    </div>

                    <div>
                        <label style={{ fontWeight: "500" }}>Confirm Password *</label>
                        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} style={inputStyle} />
                        {errors.confirmPassword && <div style={{ color: "#f44336", fontSize: "12px" }}>• {errors.confirmPassword}</div>}
                    </div>

                    <div>
                        <label style={{ fontWeight: "500" }}>Phone *</label>
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} style={inputStyle} placeholder="10+ digits" />
                        {errors.phone && <div style={{ color: "#f44336", fontSize: "12px" }}>• {errors.phone}</div>}
                    </div>

                    <div>
                        <label style={{ fontWeight: "500" }}>Date of Birth *</label>
                        <input type="date" name="dob" value={form.dob} onChange={handleChange} style={inputStyle} />
                        {errors.dob && <div style={{ color: "#f44336", fontSize: "12px" }}>• {errors.dob}</div>}
                    </div>

                    <div>
                        <label style={{ fontWeight: "500" }}>Gender *</label>
                        <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle}>
                            <option value="">Select</option>
                            {genders.map((g) => <option key={g} value={g}>{g}</option>)}
                        </select>
                        {errors.gender && <div style={{ color: "#f44336", fontSize: "12px" }}>• {errors.gender}</div>}
                    </div>

                    <div>
                        <label style={{ fontWeight: "500" }}>Address *</label>
                        <textarea name="address" value={form.address} onChange={handleChange} style={{ ...inputStyle, resize: "vertical" }} rows={2} />
                        {errors.address && <div style={{ color: "#f44336", fontSize: "12px" }}>• {errors.address}</div>}
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                            <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} style={{ marginRight: 8 }} />
                            I agree to the terms and conditions *
                        </label>
                        {errors.agree && <div style={{ color: "#f44336", fontSize: "12px" }}>• {errors.agree}</div>}
                    </div>

                    <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", backgroundColor: loading ? "#ccc" : "#2196F3", color: "white", border: "none", borderRadius: "4px", fontSize: "16px", fontWeight: "500", cursor: loading ? "not-allowed" : "pointer" }}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default SignUp;
