import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  moduleType: { type: String, required: true, enum: ['Lesson', 'Quiz'] },
  // For Lessons
  videoUrl: String,
  textContent: String,
  // For Quizzes
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: String,
  }],
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  modules: [moduleSchema],
}, {
  timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);
export default Course;