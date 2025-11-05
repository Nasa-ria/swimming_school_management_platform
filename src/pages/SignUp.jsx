import React, { useState } from "react";


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

    const validate = () => {
        const newErrors = {};
        if (!form.fullName) newErrors.fullName = "Full name is required";
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
            newErrors.email = "Valid email is required";
        if (!form.password || form.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";
        if (form.password !== form.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";
        if (!form.phone || !/^\d{10,}$/.test(form.phone))
            newErrors.phone = "Valid phone number is required";
        if (!form.dob) newErrors.dob = "Date of birth is required";
        if (!form.gender) newErrors.gender = "Gender is required";
        if (!form.address) newErrors.address = "Address is required";
        if (!form.agree) newErrors.agree = "You must agree to terms";
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            setSubmitted(true);
            // Submit logic here (e.g., API call)
        }
    };

    return (
        <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, boxShadow: "0 2px 8px #ccc", borderRadius: 8 }}>
            <h2>Sign Up</h2>
            {submitted ? (
                <div style={{ color: "green", marginBottom: 16 }}>Registration successful!</div>
            ) : (
                <form onSubmit={handleSubmit} noValidate>
                    <div>
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            autoComplete="name"
                        />
                        {errors.fullName && <div style={{ color: "red" }}>{errors.fullName}</div>}
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                        {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                        {errors.password && <div style={{ color: "red" }}>{errors.password}</div>}
                    </div>
                    <div>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                        {errors.confirmPassword && <div style={{ color: "red" }}>{errors.confirmPassword}</div>}
                    </div>
                    <div>
                        <label>Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            autoComplete="tel"
                        />
                        {errors.phone && <div style={{ color: "red" }}>{errors.phone}</div>}
                    </div>
                    <div>
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={form.dob}
                            onChange={handleChange}
                        />
                        {errors.dob && <div style={{ color: "red" }}>{errors.dob}</div>}
                    </div>
                    <div>
                        <label>Gender</label>
                        <select name="gender" value={form.gender} onChange={handleChange}>
                            <option value="">Select</option>
                            {genders.map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                        {errors.gender && <div style={{ color: "red" }}>{errors.gender}</div>}
                    </div>
                    <div>
                        <label>Address</label>
                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            rows={2}
                        />
                        {errors.address && <div style={{ color: "red" }}>{errors.address}</div>}
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                name="agree"
                                checked={form.agree}
                                onChange={handleChange}
                            />
                            I agree to the terms and conditions
                        </label>
                        {errors.agree && <div style={{ color: "red" }}>{errors.agree}</div>}
                    </div>
                    <button type="submit" style={{ marginTop: 16 }}>Sign Up</button>
                </form>
            )}
        </div>
    );
}

export default SignUp;