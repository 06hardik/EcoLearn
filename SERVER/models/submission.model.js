import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Event',
  },
  caption: {
    type: String,
  },
}, {
  timestamps: true,
});

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;