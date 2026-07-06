const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  enrollCourse,
  getEnrolledCourses,
  getInstructorCourses,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my-enrollments', protect, authorize('student'), getEnrolledCourses);
router.get('/my-created-courses', protect, authorize('instructor'), getInstructorCourses);

router
  .route('/')
  .get(getCourses)
  .post(protect, authorize('instructor'), createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('instructor'), updateCourse)
  .delete(protect, authorize('instructor'), deleteCourse);

router
  .route('/:id/enroll')
  .post(protect, authorize('student'), enrollCourse);

module.exports = router;
