import mongoose from 'mongoose';
const { v4: uuidv4 } = require('uuid');

const EventSchema = new mongoose.Schema({
    title: String,
    date: String,
  });

const TaskSchema = new mongoose.Schema({
    taskName: String,
    dateStarted: String,
    deadline: String,
    status: String,
});

const UserSchema = new mongoose.Schema({
    id: { type: Number },
    username: { type: String, required: true },
    password: { type: String, required: true },
    gmail: { type: String, required: true, unique: true },
    tasks: [TaskSchema],
    events: [EventSchema],
    profilePic: {
        type: String,
        default: '',
      },
    coverPic: {
      type: String,
      default: '',
    },
});

const User = mongoose.model('User', UserSchema);
const Task = mongoose.model('Task', TaskSchema);

export default User;
export { Task };
