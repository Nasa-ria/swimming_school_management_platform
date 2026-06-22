import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../components/Toast';

export default function ManageAssignments() {
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, instructorsRes] = await Promise.all([
          api.get('/admin/assignments'),
          api.get('/admin/instructors')
        ]);
        setStudents(studentsRes.data);
        setInstructors(instructorsRes.data);
      } catch (err) {
        showToast('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssign = async (studentId, instructorId) => {
    try {
      setProcessing(studentId);
      await api.post('/admin/assign-instructor', { student_id: studentId, instructor_id: instructorId });
      showToast('Instructor assigned successfully', 'success');
      
      // Update local state
      const instructor = instructors.find(i => i._id === instructorId);
      setStudents(students.map(s => 
        s._id === studentId 
          ? { ...s, student_profile: { ...s.student_profile, assigned_instructor: instructor } }
          : s
      ));
    } catch (err) {
      showToast('Failed to assign instructor', 'error');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Instructor Assignments</h1>
        <p className="page-subtitle">Match students with their dedicated swimming coaches and monitor training relationships.</p>
      </header>

      <section className="table-wrapper-saas">
        <table className="table-saas">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Contact Email</th>
              <th>Current Assignment</th>
              <th style={{ textAlign: 'right' }}>Update Assignment</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{student.name}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{student.email}</td>
                <td>
                  {student.student_profile?.assigned_instructor?.name ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--info-soft)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>
                        {student.student_profile.assigned_instructor.name[0]}
                      </div>
                      <span className="badge-saas info" style={{ fontWeight: 700 }}>
                        Coach {student.student_profile.assigned_instructor.name}
                      </span>
                    </div>
                  ) : (
                    <span className="badge-saas warning">Unassigned</span>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <select 
                    className="input-saas"
                    style={{ width: '220px', padding: '6px 12px', fontSize: '0.8125rem', fontWeight: 600 }}
                    value={student.student_profile?.assigned_instructor?._id || ''}
                    onChange={(e) => handleAssign(student._id, e.target.value)}
                    disabled={processing === student._id}
                  >
                    <option value="">Select a coach...</option>
                    {instructors.map(inst => (
                      <option key={inst._id} value={inst._id}>{inst.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '4rem' }}>
                  <div style={{ color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏊‍♂️</div>
                    <h3 style={{ fontWeight: 800, color: 'var(--navy)' }}>No students enrolled</h3>
                    <p>New students will appear here once they join the school.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
