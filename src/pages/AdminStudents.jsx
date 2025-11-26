import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentStudent, setCurrentStudent] = useState({ name: '', email: '', status: 'Active' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setStudents([
                { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', enrolled: 'Beginner Swim' },
                { id: 2, name: 'Jane Roe', email: 'jane@example.com', status: 'Inactive', enrolled: 'None' },
                { id: 3, name: 'Bob Smith', email: 'bob@example.com', status: 'Active', enrolled: 'Advanced Diving' },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            setStudents(students.filter(s => s.id !== id));
        }
    };

    const handleEdit = (student) => {
        setCurrentStudent(student);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleAdd = () => {
        setCurrentStudent({ name: '', email: '', status: 'Active', enrolled: 'None' });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            setStudents(students.map(s => s.id === currentStudent.id ? currentStudent : s));
        } else {
            setStudents([...students, { ...currentStudent, id: Date.now() }]);
        }
        setShowModal(false);
    };

    if (loading) return <div className="dashboard-loading">Loading students...</div>;

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <Link to="/admin" className="back-link">← Back to Dashboard</Link>
                    <h1>Manage Students</h1>
                </div>
                <button className="btn btn-primary" onClick={handleAdd}>Add New Student</button>
            </header>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Enrolled Class</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id}>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>
                                    <span className={`status-badge ${student.status.toLowerCase()}`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td>{student.enrolled}</td>
                                <td>
                                    <button className="btn-icon edit" onClick={() => handleEdit(student)}>Edit</button>
                                    <button className="btn-icon delete" onClick={() => handleDelete(student.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{isEditing ? 'Edit Student' : 'Add New Student'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={currentStudent.name}
                                    onChange={e => setCurrentStudent({ ...currentStudent, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={currentStudent.email}
                                    onChange={e => setCurrentStudent({ ...currentStudent, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    value={currentStudent.status}
                                    onChange={e => setCurrentStudent({ ...currentStudent, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminStudents;
