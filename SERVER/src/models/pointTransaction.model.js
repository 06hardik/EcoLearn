import mongoose from 'mongoose';

const pointTransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export const PointTransaction = mongoose.model('PointTransaction', pointTransactionSchema);
