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

export interface ITeam extends Document {
    team_name: string;
    leader_id: mongoose.Types.ObjectId;
    member_limit: number;
    invited_users: InvitedUser[];
    join_requests: JoinRequest[];
    members_lists: { user_id: mongoose.Types.ObjectId; username: string }[];
    tasks: mongoose.Types.ObjectId[];
}

const TeamSchema = new Schema<ITeam>(
    {
        team_name: { type: String, required: true },
        leader_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        member_limit: { type: Number, default: 3 },
        invited_users: [InvitedUserSchema],
        join_requests: [JoinRequestSchema],
        members_lists: [
            {
                user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                username: String,
                _id: false,
            },
        ],
        tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ITeam>('Team', TeamSchema);
