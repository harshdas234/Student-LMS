import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Clock, ChevronDown, ChevronRight, PlayCircle, ArrowLeft, CheckCircle } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [activeLesson, setActiveLesson] = useState(null);
  const [enrollMsg, setEnrollMsg] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/api/courses/${id}`);
        setCourse(res.data.data);
        // Auto-expand first module
        if (res.data.data.modules && res.data.data.modules.length > 0) {
          setExpandedModules({ 0: true });
          setActiveLesson(res.data.data.modules[0].lessons[0]);
        }
      } catch (err) {
        console.error('Failed to fetch course', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const toggleModule = (index) => {
    setExpandedModules(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`/api/courses/${id}/enroll`, {}, config);
      setEnrollMsg('✅ Successfully enrolled!');
    } catch (err) {
      setEnrollMsg(err.response?.data?.error || 'Failed to enroll');
    }
  };

  const totalLessons = course?.modules?.reduce((sum, m) => sum + m.lessons.length, 0) || 0;

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading course...</div>;
  if (!course) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Course not found.</div>;

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1rem' }}>
        <ArrowLeft size={18} /> Back to Courses
      </button>

      {/* Course Header */}
      <div className="glass-panel" style={{ display: 'flex', gap: '2rem', padding: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <img src={course.thumbnail} alt={course.title} style={{ width: '320px', height: '180px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{course.title}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.6' }}>{course.description}</p>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BookOpen size={16} /> {course.modules?.length || 0} Modules</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><PlayCircle size={16} /> {totalLessons} Lessons</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={16} /> Self-paced</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{course.price === 0 ? 'Free' : `$${course.price}`}</span>
            <button onClick={handleEnroll} className="btn btn-primary">Enroll Now</button>
            {enrollMsg && <span style={{ fontSize: '0.9rem', color: enrollMsg.includes('✅') ? '#10b981' : 'var(--error-color)' }}>{enrollMsg}</span>}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Sidebar: Module List */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Course Content</h2>
          {course.modules?.map((module, mIndex) => (
            <div key={mIndex} style={{ marginBottom: '0.75rem' }}>
              <button
                onClick={() => toggleModule(mIndex)}
                style={{
                  width: '100%', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--border-color)',
                  borderRadius: '8px', padding: '0.75rem 1rem', color: '#fff', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', fontSize: '0.95rem', fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                <span>{module.title}</span>
                {expandedModules[mIndex] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {expandedModules[mIndex] && (
                <div style={{ paddingLeft: '0.5rem', marginTop: '0.5rem' }}>
                  {module.lessons.map((lesson, lIndex) => (
                    <button
                      key={lIndex}
                      onClick={() => setActiveLesson(lesson)}
                      style={{
                        width: '100%', background: activeLesson?.title === lesson.title ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        border: 'none', borderRadius: '6px', padding: '0.6rem 0.75rem', color: activeLesson?.title === lesson.title ? 'var(--accent-blue)' : 'var(--text-secondary)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left', fontSize: '0.85rem',
                        transition: 'all 0.2s ease', marginBottom: '2px'
                      }}
                    >
                      <PlayCircle size={14} style={{ flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{lesson.title}</span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{lesson.duration}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main: Active Lesson Content */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          {activeLesson ? (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-blue)', fontSize: '0.85rem' }}>
                <PlayCircle size={16} /> Now Viewing
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{activeLesson.title}</h2>
              
              {/* Simulated Video Player */}
              <div style={{ background: '#000', borderRadius: '8px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}></div>
                <div style={{ position: 'relative', textAlign: 'center' }}>
                  <PlayCircle size={48} color="var(--accent-blue)" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Video Content</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                <Clock size={16} /> Duration: {activeLesson.duration}
              </div>
              
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', padding: '1.5rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                <h3 style={{ color: '#fff', marginBottom: '0.75rem' }}>Lesson Overview</h3>
                <p>{activeLesson.content}</p>
              </div>

              <button className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} /> Mark as Complete
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>Select a lesson from the sidebar to start learning.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
