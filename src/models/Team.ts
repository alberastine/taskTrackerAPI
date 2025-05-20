import mongoose, { Schema, Document } from 'mongoose';

interface JoinRequest {
    user_id: mongoose.Types.ObjectId;
    username: string;
    requested_at: Date;
}

interface InvitedUser {
    user_id: mongoose.Types.ObjectId;
    username: string;
    invited_at: Date;
}

interface TeamTask {
    task_name: string;
    assigned_to: string;
    description: string;
    date_published: string;
    deadline: string;
    status: string;
}

interface MembersList {
    user_id: mongoose.Types.ObjectId;
    username: string;
}

const JoinRequestSchema = new Schema<JoinRequest>(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        username: { type: String, required: true },
        requested_at: { type: Date, default: Date.now },
    },
    { _id: false }
);

const InvitedUserSchema = new Schema<InvitedUser>(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        username: { type: String, required: true },
        invited_at: { type: Date, default: Date.now },
    },
    { _id: false }
);

const TeamTaskSchema = new Schema<TeamTask>({
    task_name: { type: String, required: true },
    assigned_to: { type: String },
    description: { type: String, required: true },
    date_published: { type: String, required: true },
    deadline: { type: String, required: true },
    status: { type: String },
});

const MembersListSchema = new Schema<MembersList>(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        username: { type: String, required: true },
    },
    { _id: false }
);

export interface ITeam extends Document {
    team_name: string;
    leader_id: mongoose.Types.ObjectId;
    leader_username: string;
    member_limit: number;
    invited_users: InvitedUser[];
    join_requests: JoinRequest[];
    members_lists: MembersList[];
    tasks: TeamTask[];
}

const TeamSchema = new Schema<ITeam>(
    {
        team_name: { type: String, required: true },
        leader_username: { type: String, required: true },
        leader_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        member_limit: { type: Number, default: 3 },
        invited_users: [InvitedUserSchema],
        join_requests: [JoinRequestSchema],
        members_lists: [MembersListSchema],
        tasks: [TeamTaskSchema],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ITeam>('Team', TeamSchema);
