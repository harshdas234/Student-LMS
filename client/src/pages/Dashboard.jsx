import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Award, BarChart2, Plus, X, ArrowLeft, Edit2, Trash2, PlusCircle, Save } from 'lucide-react';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Managed Course State for Instructor Course Management
  const [managedCourse, setManagedCourse] = useState(null);
  
  // Create Course Form State
  const [formData, setFormData] = useState({ title: '', description: '', price: '' });
  
  // Manage Course Editing Form State
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editModules, setEditModules] = useState([]);
  
  // Helpers for adding module/lesson in management panel
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonContent, setNewLessonContent] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState('');
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const endpoint = user.role === 'instructor' 
        ? '/api/courses/my-created-courses' 
        : '/api/courses/my-enrollments';
        
      const res = await axios.get(endpoint, config);
      setCourses(res.data.data);
    } catch (err) {
      console.error('Error fetching courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
      
      const res = await axios.post('/api/courses', formData, config);
      setCourses([...courses, res.data.data]);
      setShowModal(false);
      setFormData({ title: '', description: '', price: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create course');
    }
  };

  // Open Course Management Portal
  const startManaging = (course) => {
    setManagedCourse(course);
    setEditTitle(course.title);
    setEditDescription(course.description);
    setEditPrice(course.price);
    setEditModules(course.modules || []);
    setSelectedModuleIndex(0);
  };

  // Save changes to course basic info and modules/lessons
  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
      
      const body = {
        title: editTitle,
        description: editDescription,
        price: Number(editPrice),
        modules: editModules
      };

      const res = await axios.put(`/api/courses/${managedCourse._id}`, body, config);
      
      // Update local courses state
      setCourses(courses.map(c => c._id === managedCourse._id ? res.data.data : c));
      setManagedCourse(res.data.data);
      alert('Course updated successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update course');
    }
  };

  // Delete Course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you absolutely sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`/api/courses/${courseId}`, config);
      setCourses(courses.filter(c => c._id !== courseId));
      setManagedCourse(null);
      alert('Course deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete course');
    }
  };

  // Add Module
  const handleAddModule = () => {
    if (!newModuleTitle.trim()) return;
    const updated = [...editModules, { title: newModuleTitle, lessons: [] }];
    setEditModules(updated);
    setNewModuleTitle('');
  };

  // Remove Module
  const handleRemoveModule = (modIndex) => {
    const updated = editModules.filter((_, idx) => idx !== modIndex);
    setEditModules(updated);
    if (selectedModuleIndex >= updated.length && updated.length > 0) {
      setSelectedModuleIndex(updated.length - 1);
    }
  };

  // Add Lesson to Module
  const handleAddLesson = () => {
    if (!newLessonTitle.trim() || !newLessonContent.trim()) return;
    if (editModules.length === 0) {
      alert('Please add a module first.');
      return;
    }
    const updated = [...editModules];
    updated[selectedModuleIndex].lessons.push({
      title: newLessonTitle,
      content: newLessonContent,
      duration: newLessonDuration || '15 min'
    });
    setEditModules(updated);
    setNewLessonTitle('');
    setNewLessonContent('');
    setNewLessonDuration('');
  };

  // Remove Lesson
  const handleRemoveLesson = (modIdx, lesIdx) => {
    const updated = [...editModules];
    updated[modIdx].lessons = updated[modIdx].lessons.filter((_, idx) => idx !== lesIdx);
    setEditModules(updated);
  };

  // Management Portal UI View
  if (managedCourse) {
    return (
      <div className="animate-fade-in">
        <button onClick={() => setManagedCourse(null)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Manage Course: <span style={{ color: 'var(--accent-blue)' }}>{managedCourse.title}</span></h2>
          <button onClick={() => handleDeleteCourse(managedCourse._id)} className="btn" style={{ backgroundColor: 'var(--error-color)', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trash2 size={16} /> Delete Course
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem', alignItems: 'start' }}>
          {/* Basic Details Form */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Edit2 size={18} /> Basic Info</h3>
            <div className="form-group">
              <label>Course Title</label>
              <input type="text" className="form-control" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-control" rows="4" value={editDescription} onChange={e => setEditDescription(e.target.value)}></textarea>
            </div>
            <div className="form-group">
              <label>Price ($)</label>
              <input type="number" className="form-control" value={editPrice} onChange={e => setEditPrice(e.target.value)} />
            </div>
            <button onClick={handleSaveChanges} className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
              <Save size={16} /> Save Changes
            </button>
          </div>

          {/* Syllabus Planner */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={18} /> Curriculum Planner</h3>
            
            {/* Add Module Input */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="New Module Title (e.g. Module 1: Intro)" 
                value={newModuleTitle}
                onChange={e => setNewModuleTitle(e.target.value)}
              />
              <button onClick={handleAddModule} className="btn btn-primary" style={{ padding: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <Plus size={20} />
              </button>
            </div>

            {/* List of Modules & Lessons */}
            <div style={{ marginBottom: '2rem' }}>
              {editModules.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>No modules added yet. Add one above!</p>
              ) : (
                editModules.map((mod, mIdx) => (
                  <div key={mIdx} style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: 'var(--accent-blue)' }}>{mod.title}</strong>
                      <button onClick={() => handleRemoveModule(mIdx)} style={{ background: 'transparent', border: 'none', color: 'var(--error-color)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                    {/* Lessons list inside this module */}
                    <div style={{ paddingLeft: '1rem' }}>
                      {mod.lessons?.length === 0 ? (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No lessons in this module.</p>
                      ) : (
                        mod.lessons?.map((les, lIdx) => (
                          <div key={lIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', padding: '0.25rem 0', borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>📄 {les.title} ({les.duration})</span>
                            <button onClick={() => handleRemoveLesson(mIdx, lIdx)} style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.7)', cursor: 'pointer' }}><X size={14} /></button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Lesson Section */}
            {editModules.length > 0 && (
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PlusCircle size={16} /> Add Lesson</h4>
                <div className="form-group">
                  <label>Select Module Target</label>
                  <select className="form-control" value={selectedModuleIndex} onChange={e => setSelectedModuleIndex(Number(e.target.value))}>
                    {editModules.map((mod, idx) => (
                      <option key={idx} value={idx}>{mod.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Lesson Title</label>
                  <input type="text" className="form-control" placeholder="e.g. Setting up node" value={newLessonTitle} onChange={e => setNewLessonTitle(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Lesson Content / Video Description</label>
                  <textarea className="form-control" rows="2" placeholder="Describe the topics covered in this lesson..." value={newLessonContent} onChange={e => setNewLessonContent(e.target.value)}></textarea>
                </div>
                <div className="form-group">
                  <label>Duration (e.g. 15 min)</label>
                  <input type="text" className="form-control" placeholder="15 min" value={newLessonDuration} onChange={e => setNewLessonDuration(e.target.value)} />
                </div>
                <button onClick={handleAddLesson} className="btn btn-outline" style={{ width: '100%' }}>Add Lesson to Module</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Hello, <span style={{ color: 'var(--accent-blue)' }}>{user.name}</span>!
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Welcome back to your {user.role === 'instructor' ? 'instructor dashboard' : 'learning dashboard'}.
          </p>
        </div>
        {user.role === 'instructor' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Course</button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '50%' }}>
             <BookOpen color="var(--accent-blue)" size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{courses.length}</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{user.role === 'instructor' ? 'Active Courses' : 'Enrolled Courses'}</p>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '50%' }}>
             <Award color="#10b981" size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{user.role === 'instructor' ? (courses.length * 5) : '2'}</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{user.role === 'instructor' ? 'Total Students' : 'Certificates Earned'}</p>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '1rem', borderRadius: '50%' }}>
             <BarChart2 color="#f59e0b" size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{user.role === 'instructor' ? '$1,450' : '65%'}</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{user.role === 'instructor' ? 'Total Revenue' : 'Avg. Course Progress'}</p>
          </div>
        </div>
      </div>

      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          {user.role === 'instructor' ? 'Your Courses' : 'Continue Learning'}
        </h2>
        
        {loading ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>Loading your data...</div>
        ) : courses.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            {user.role === 'instructor' ? (
               <p>You haven't created any courses yet. Click "Create Course" to get started.</p>
            ) : (
               <p>You are not enrolled in any courses yet. Browse the catalog to start learning.</p>
            )}
          </div>
        ) : (
          <div className="course-grid">
            {courses.map(course => (
              <div key={course._id} className="course-card glass-panel" style={{ padding: '1rem' }}>
                 <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{course.title}</h3>
                 <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{course.description.substring(0, 50)}...</p>
                 <button 
                   onClick={() => user.role === 'instructor' ? startManaging(course) : navigate(`/course/${course._id}`)} 
                   className="btn btn-outline" 
                   style={{ marginTop: '1rem', width: '100%', padding: '0.5rem' }}
                 >
                   {user.role === 'instructor' ? 'Manage Course' : 'Resume Learning'}
                 </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal for Creating Course */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X /></button>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Course</h2>
            <form onSubmit={handleCreateCourse}>
              <div className="form-group">
                <label>Course Title</label>
                <input type="text" className="form-control" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input type="number" className="form-control" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Publish Course</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
