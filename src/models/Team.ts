import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface ITeam extends Document {
    team_name: string;
    leader_id: mongoose.Types.ObjectId;
    member_limit: number;
    members_lists: { user_id: mongoose.Types.ObjectId; username: string }[];
    tasks: mongoose.Types.ObjectId[];
}

const TeamSchema: Schema = new Schema(
    {
        team_name: { type: String, required: true },
        leader_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        member_limit: { type: Number, default: 3 },
        members_lists: [
            {
                user_id: mongoose.Schema.Types.ObjectId,
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
