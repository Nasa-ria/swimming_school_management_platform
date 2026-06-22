import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css'; // Reusing dashboard styles for consistency

function AdminInstructors() {
    const [instructors, setInstructors] = useState([]);
    const [sessions, setSessions] = useState([]); // New state for sessions
    const [students, setStudents] = useState([]); // New state for students
    const [loading, setLoading] = useState(true);
    const [showInstructorModal, setShowInstructorModal] = useState(false); // Renamed for clarity
    const [showAssignSessionsModal, setShowAssignSessionsModal] = useState(false); // New state for sessions modal
    const [showAssignStudentsModal, setShowAssignStudentsModal] = useState(false); // New state for students modal
    const [currentInstructor, setCurrentInstructor] = useState({ id: null, name: '', email: '', specialty: '', assignedSessionIds: [], assignedStudentIds: [] }); // Added assigned IDs
    const [isEditing, setIsEditing] = useState(false);

    // Mock data fetch
    useEffect(() => {
        setTimeout(() => {
            const mockInstructors = [
                { id: 1, name: 'Sarah Smith', email: 'sarah@swim.com', specialty: 'Advanced Swimmers', assignedSessionIds: [101, 103], assignedStudentIds: [1, 3] },
                { id: 2, name: 'Mike Johnson', email: 'mike@swim.com', specialty: 'Beginners & Kids', assignedSessionIds: [102], assignedStudentIds: [2] },
                { id: 3, name: 'Emily Davis', email: 'emily@swim.com', specialty: 'Competitive Training', assignedSessionIds: [], assignedStudentIds: [] },
            ];
            const mockSessions = [
                { id: 101, name: 'Morning Lap Swim', date: '2023-10-26', time: '08:00 AM' },
                { id: 102, name: 'Kids Beginner Class', date: '2023-10-26', time: '03:00 PM' },
                { id: 103, name: 'Advanced Stroke Clinic', date: '2023-10-27', time: '06:00 PM' },
                { id: 104, name: 'Evening Open Swim', date: '2023-10-27', time: '07:00 PM' },
            ];
            const mockStudents = [
                { id: 1, name: 'Alice Wonderland', email: 'alice@example.com' },
                { id: 2, name: 'Bob The Builder', email: 'bob@example.com' },
                { id: 3, name: 'Charlie Chaplin', email: 'charlie@example.com' },
                { id: 4, name: 'Diana Prince', email: 'diana@example.com' },
            ];

            setInstructors(mockInstructors);
            setSessions(mockSessions);
            setStudents(mockStudents);
            setLoading(false);
        }, 500);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this instructor?')) {
            setInstructors(instructors.filter(inst => inst.id !== id));
        }
    };

    const handleEdit = (instructor) => {
        setCurrentInstructor(instructor);
        setIsEditing(true);
        setShowInstructorModal(true);
    };

    const handleAdd = () => {
        setCurrentInstructor({ id: null, name: '', email: '', specialty: '', assignedSessionIds: [], assignedStudentIds: [] });
        setIsEditing(false);
        setShowInstructorModal(true);
    };

    const handleSubmitInstructor = (e) => {
        e.preventDefault();
        if (isEditing) {
            setInstructors(instructors.map(inst => inst.id === currentInstructor.id ? currentInstructor : inst));
        } else {
            setInstructors([...instructors, { ...currentInstructor, id: Date.now() }]);
        }
        setShowInstructorModal(false);
    };

    const handleAssignSessions = (instructor) => {
        setCurrentInstructor(instructor);
        setShowAssignSessionsModal(true);
    };

    const handleSessionToggle = (sessionId) => {
        setCurrentInstructor(prev => {
            const newAssignedSessionIds = prev.assignedSessionIds.includes(sessionId)
                ? prev.assignedSessionIds.filter(id => id !== sessionId)
                : [...prev.assignedSessionIds, sessionId];
            return { ...prev, assignedSessionIds: newAssignedSessionIds };
        });
    };

    const handleSubmitSessions = () => {
        setInstructors(instructors.map(inst => inst.id === currentInstructor.id ? currentInstructor : inst));
        setShowAssignSessionsModal(false);
    };

    const handleAssignStudents = (instructor) => {
        setCurrentInstructor(instructor);
        setShowAssignStudentsModal(true);
    };

    const handleStudentToggle = (studentId) => {
        setCurrentInstructor(prev => {
            const newAssignedStudentIds = prev.assignedStudentIds.includes(studentId)
                ? prev.assignedStudentIds.filter(id => id !== studentId)
                : [...prev.assignedStudentIds, studentId];
            return { ...prev, assignedStudentIds: newAssignedStudentIds };
        });
    };

    const handleSubmitStudents = () => {
        setInstructors(instructors.map(inst => inst.id === currentInstructor.id ? currentInstructor : inst));
        setShowAssignStudentsModal(false);
    };

    if (loading) return <div className="dashboard-loading">Loading instructors...</div>;

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <Link to="/admin" className="back-link">← Back to Dashboard</Link>
                    <h1>Manage Instructors</h1>
                </div>
                <button className="btn btn-primary" onClick={handleAdd}>Add New Instructor</button>
            </header>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Specialty</th>
                            <th>Assigned Sessions</th>
                            <th>Assigned Students</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {instructors.map(inst => (
                            <tr key={inst.id}>
                                <td>{inst.name}</td>
                                <td>{inst.email}</td>
                                <td>{inst.specialty}</td>
                                <td>
                                    {inst.assignedSessionIds.length > 0
                                        ? inst.assignedSessionIds.map(id => sessions.find(s => s.id === id)?.name).filter(Boolean).join(', ')
                                        : 'None'}
                                </td>
                                <td>
                                    {inst.assignedStudentIds.length > 0
                                        ? inst.assignedStudentIds.map(id => students.find(s => s.id === id)?.name).filter(Boolean).join(', ')
                                        : 'None'}
                                </td>
                                <td>
                                    <button className="btn-icon edit" onClick={() => handleEdit(inst)}>Edit</button>
                                    <button className="btn-icon assign" onClick={() => handleAssignSessions(inst)}>Sessions</button>
                                    <button className="btn-icon assign" onClick={() => handleAssignStudents(inst)}>Students</button>
                                    <button className="btn-icon delete" onClick={() => handleDelete(inst.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Instructor Add/Edit Modal */}
            {showInstructorModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{isEditing ? 'Edit Instructor' : 'Add New Instructor'}</h2>
                        <form onSubmit={handleSubmitInstructor}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={currentInstructor.name}
                                    onChange={e => setCurrentInstructor({ ...currentInstructor, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={currentInstructor.email}
                                    onChange={e => setCurrentInstructor({ ...currentInstructor, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Specialty</label>
                                <input
                                    type="text"
                                    value={currentInstructor.specialty}
                                    onChange={e => setCurrentInstructor({ ...currentInstructor, specialty: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowInstructorModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Sessions Modal */}
            {showAssignSessionsModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Assign Sessions to {currentInstructor.name}</h2>
                        <div className="assignment-list">
                            {sessions.map(session => (
                                <div key={session.id} className="assignment-item">
                                    <input
                                        type="checkbox"
                                        id={`session-${session.id}`}
                                        checked={currentInstructor.assignedSessionIds.includes(session.id)}
                                        onChange={() => handleSessionToggle(session.id)}
                                    />
                                    <label htmlFor={`session-${session.id}`}>{session.name} ({session.date} {session.time})</label>
                                </div>
                            ))}
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn btn-ghost" onClick={() => setShowAssignSessionsModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={handleSubmitSessions}>Save Assignments</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Students Modal */}
            {showAssignStudentsModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Assign Students to {currentInstructor.name}</h2>
                        <div className="assignment-list">
                            {students.map(student => (
                                <div key={student.id} className="assignment-item">
                                    <input
                                        type="checkbox"
                                        id={`student-${student.id}`}
                                        checked={currentInstructor.assignedStudentIds.includes(student.id)}
                                        onChange={() => handleStudentToggle(student.id)}
                                    />
                                    <label htmlFor={`student-${student.id}`}>{student.name} ({student.email})</label>
                                </div>
                            ))}
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn btn-ghost" onClick={() => setShowAssignStudentsModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={handleSubmitStudents}>Save Assignments</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminInstructors;
