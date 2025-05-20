import mongoose, { Schema, Document } from 'mongoose';

interface UserTask {
    taskName: string;
    dateStarted: string;
    deadline: string;
    status: string;
}

interface UserEvent {
    title: string;
    date: string;
}

export interface IUser extends Document {
    username: string;
    password: string;
    gmail: string;
    profilePic?: string;
    coverPic?: string;
    tasks: UserTask[];
    events: UserEvent[];
}

const TaskSchema = new Schema<UserTask>({
    taskName: { type: String, required: true },
    dateStarted: { type: String, required: true },
    deadline: { type: String, required: true },
    status: { type: String, required: true },
});

const EventSchema = new Schema<UserEvent>({
    title: { type: String, required: true },
    date: { type: String, required: true },
});

const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        gmail: { type: String, required: true, unique: true },
        profilePic: { type: String, default: '' },
        coverPic: { type: String, default: '' },
        tasks: [TaskSchema],
        events: [EventSchema],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IUser>('User', UserSchema);
export const Task = mongoose.model<UserTask>('Task', TaskSchema);
