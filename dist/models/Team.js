"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const JoinRequestSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    username: { type: String, required: true },
    requested_at: { type: Date, default: Date.now },
}, { _id: false });
const InvitedUserSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    username: { type: String, required: true },
    invited_at: { type: Date, default: Date.now },
}, { _id: false });
const TeamTaskSchema = new mongoose_1.Schema({
    task_name: { type: String, required: true },
    assigned_to: {
        type: String,
    },
    description: { type: String, required: true },
    date_published: { type: String, required: true },
    deadline: { type: String, required: true },
    status: { type: String },
});
const MembersListSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    username: { type: String, required: true },
}, { _id: false });
const TeamSchema = new mongoose_1.Schema({
    team_name: { type: String, required: true },
    leader_username: { type: String, required: true },
    leader_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    member_limit: { type: Number, default: 3 },
    invited_users: [InvitedUserSchema],
    join_requests: [JoinRequestSchema],
    members_lists: [MembersListSchema],
    tasks: [TeamTaskSchema],
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Team', TeamSchema);
