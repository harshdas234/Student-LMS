import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, Clock, BookOpen, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollError, setEnrollError] = useState(null);
  const [enrollSuccess, setEnrollSuccess] = useState(null);
  
  const coursesRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/courses');
        setCourses(res.data.data);
      } catch (err) {
        console.error('Failed to fetch courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const scrollToCourses = () => {
    coursesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnroll = async (e, courseId) => {
    e.stopPropagation();
    setEnrollError(null);
    setEnrollSuccess(null);
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`/api/courses/${courseId}/enroll`, {}, config);
      setEnrollSuccess('Successfully enrolled! Check your dashboard.');
    } catch (err) {
      setEnrollError(err.response?.data?.error || 'Failed to enroll');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading awesome courses...</div>;
  }

  return (
    <div className="animate-fade-in">
      <section className="hero-section glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#fff' }}>
          Welcome to <span style={{ color: 'var(--accent-blue)' }}>STUDENT LMS</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Elevate your skills with our premium internship-level courses. Master full-stack development, design, and more.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={scrollToCourses}>Explore Courses</button>
          <button className="btn btn-outline" onClick={() => alert('Welcome to the best LMS platform! Sign up today to start your learning journey.')}>Learn More</button>
        </div>
      </section>

      <section ref={coursesRef} style={{ scrollMarginTop: '100px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen /> Featured Courses
        </h2>
        
        {enrollSuccess && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{enrollSuccess}</div>}
        {enrollError && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{enrollError}</div>}

        <div className="course-grid">
          {courses.map((course) => {
            return (
              <div key={course._id} className="course-card glass-panel" onClick={() => navigate(`/course/${course._id}`)} style={{ cursor: 'pointer' }}>
                <div style={{ position: 'relative' }}>
                  <img src={course.thumbnail || 'https://picsum.photos/seed/course/800/450'} alt={course.title} className="course-img" />
                  {course.instructor && (
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(59, 130, 246, 0.9)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', color: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                      {course.instructor.name}
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={12} color="#fbbf24" /> 4.8
                  </div>
                </div>
                <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-desc">{course.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                     <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={16} /> {course.modules?.length || 0} Modules</span>
                     <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><PlayCircle size={16} /> {totalLessons} Lessons</span>
                  </div>
                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
                      {course.price === 0 ? 'Free' : `$${course.price}`}
                    </span>
                    <button onClick={(e) => handleEnroll(e, course._id)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Enroll Now</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
