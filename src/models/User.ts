import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    taskName: String,
    dateStarted: String,
    deadLine: String,
    status: String,
});

const UserSchema = new mongoose.Schema({
    id: { type: Number },
    username: { type: String, required: true },
    password: { type: String, required: true },
    gmail: { type: String, required: true },
    tasks: [TaskSchema],
});

const User = mongoose.model('User', UserSchema);

export default User;
