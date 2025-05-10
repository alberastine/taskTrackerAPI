import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import Team from '../models/Team';
import User from '../models/User';

export const createTeam = async (req: Request, res: Response) => {
    try {
        const { team_name } = req.body;
        const leader_id = (req as any).user.id;

        console.log('Received request body:', req.body);
        console.log('Team name:', team_name);
        console.log('Leader ID:', leader_id);

        // Validate team name
        if (!team_name) {
            res.status(400).json({
                message: 'Team name is required',
                details: 'The team_name field is missing in the request',
            });
            return;
        }

        if (typeof team_name !== 'string') {
            res.status(400).json({
                message: 'Invalid team name format',
                details: `Team name must be a string, received ${typeof team_name}`,
            });
            return;
        }

        if (team_name.trim().length === 0) {
            res.status(400).json({
                message: 'Invalid team name',
                details: 'Team name cannot be empty or only whitespace',
            });
            return;
        }

        const user = await User.findById(leader_id);
        if (!user) {
            res.status(404).json({
                message: 'User not found',
                details: `No user found with ID: ${leader_id}`,
            });
            return;
        }

        const newTeam = new Team({
            team_name: team_name.trim(),
            leader_id,
            member_limit: 3,
            members_lists: [],
            tasks: [],
        });

        const savedTeam = await newTeam.save();
        res.status(201).json({
            message: 'Team created successfully',
            team: savedTeam,
        });
        return;
    } catch (error) {
        console.error('Team creation error:', error);
        res.status(500).json({
            message: 'Error creating team',
            details:
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred',
        });
        return;
    }
};

export const sendTeamInvitation = async (req: Request, res: Response) => {
    try {
        const { team_id, invited_user_id } = req.body;
        const leader_id = (req as any).user.id;

        const user = await User.findById(leader_id);
        if (!user) {
            res.status(404).json({
                message: 'User not found',
                details: `No user found with ID: ${leader_id}`,
            });
            return;
        }

        const team = await Team.findById(team_id);

        // Validation checks
        if (!team) {
            res.status(404).json({ message: 'Team not found' });
            return;
        }

        if (team.leader_id.toString() !== leader_id.toString()) {
            res.status(403).json({
                message: 'Only team leader can send invitations',
            });
            return;
        }

        if (team.members_lists.length >= team.member_limit) {
            res.status(400).json({ message: 'Team is already full' });
            return;
        }

        // Find invited user to get their username
        const invitedUser = await User.findById(invited_user_id);
        if (!invitedUser) {
            res.status(404).json({
                message: 'Invited user not found',
                details: `No user found with ID: ${invited_user_id}`,
            });
            return;
        }

        // Check if user is already a member of this specific team or is the team leader
        if (
            team.members_lists.includes(invited_user_id) ||
            team.leader_id.toString() === invited_user_id.toString()
        ) {
            res.status(400).json({
                message:
                    'User is already a member of this team or is the team leader',
            });
            return;
        }

        // Add member to team
        team.members_lists.push({
            user_id: invited_user_id,
            username: invitedUser.username,
        });
        await team.save();

        res.status(200).json({
            message: 'Invitation sent and user added to team',
        });
    } catch (error) {
        res.status(500).json({ message: 'Error sending invitation', error });
    }
};

export const joinTeam = async (req: Request, res: Response) => {
    try {
        const { team_id } = req.body;
        const user_id = (req as any).user.id;
        const username = (req as any).user.username;

        const user = await User.findById(user_id);
        if (!user) {
            res.status(404).json({
                message: 'User not found',
                details: `No user found with ID: ${user_id}`,
            });
            return;
        }

        const team = await Team.findById(team_id);

        // Validation checks
        if (!team) {
            res.status(404).json({ message: 'Team not found' });
            return;
        }

        if (team.members_lists.length >= team.member_limit) {
            res.status(400).json({ message: 'Team is already full' });
            return;
        }

        // Check if user is already in this specific team
        if (
            team.members_lists.includes(user_id) ||
            team.leader_id.toString() === user_id.toString()
        ) {
            res.status(400).json({
                message:
                    'You are already a member of this team or are the team leader',
            });
            return;
        }

        // Add user to team
        team.members_lists.push({
            user_id,
            username,
        });
        await team.save();

        res.status(200).json({ message: 'Successfully joined team', team });
    } catch (error) {
        res.status(500).json({ message: 'Error joining team', error });
    }
};
export const leaveTeam = async (req: Request, res: Response) => {
    try {
        const { team_id } = req.body;
        const user_id = (req as any).user.id;

        const user = await User.findById(user_id);
        if (!user) {
            res.status(404).json({
                message: 'User not found',
                details: `No user found with ID: ${user_id}`,
            });
            return;
        }

        const team = await Team.findById(team_id);

        // Validation checks
        if (!team) {
            res.status(404).json({
                message: 'Team not found',
                details: `No team found with ID: ${team_id}`,
            });
            return;
        }

        // Check if the user is not the team leader
        if (team.leader_id.toString() === user_id.toString()) {
            res.status(400).json({
                message: 'Team leader cannot leave the team',
                details:
                    'To leave the team, you must first transfer leadership or delete the team',
            });
            return;
        }

        // Check if the user is actually a member of the team
        const isMember = team.members_lists.some(
            (member) => member.user_id.toString() === user_id.toString()
        );

        if (!isMember) {
            res.status(400).json({
                message: 'Not a team member',
                details: 'You are not a member of this team',
            });
            return;
        }

        // Remove the user from the team
        team.members_lists = team.members_lists.filter(
            (member) => member.user_id.toString() !== user_id.toString()
        );

        await team.save();

        res.status(200).json({
            message: 'Successfully left the team',
            team_id: team_id,
        });
        return;
    } catch (error) {
        console.error('Team leave error:', error);
        res.status(500).json({
            message: 'Error leaving team',
            details:
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred',
        });
        return;
    }
};

export const deleteTeam = async (req: Request, res: Response) => {
    try {
        const { team_id } = req.body;
        const user_id = (req as any).user.id;

        const user = await User.findById(user_id);
        if (!user) {
            res.status(404).json({
                message: 'User not found',
                details: `No user found with ID: ${user_id}`,
            });
            return;
        }

        const team = await Team.findById(team_id);

        // Validation checks
        if (!team) {
            res.status(404).json({
                message: 'Team not found',
                details: `No team found with ID: ${team_id}`,
            });
            return;
        }

        // Check if the user is the team leader
        if (team.leader_id.toString() !== user_id.toString()) {
            res.status(403).json({
                message: 'Unauthorized',
                details: 'Only team leader can delete the team',
            });
            return;
        }

        // Delete the team
        await Team.findByIdAndDelete(team_id);

        res.status(200).json({
            message: 'Team deleted successfully',
            team_id: team_id,
        });
        return;
    } catch (error) {
        console.error('Team deletion error:', error);
        res.status(500).json({
            message: 'Error deleting team',
            details:
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred',
        });
        return;
    }
};



// Additional helper function to get all teams a user is part of
export const getUserTeams = async (req: Request, res: Response) => {
    try {
        const user_id = (req as any).user.id;

        const user = await User.findById(user_id);
        if (!user) {
            res.status(404).json({
                message: 'User not found',
                details: `No user found with ID: ${user_id}`,
            });
            return;
        }

        const teams = await Team.find({
            $or: [{ leader_id: user_id }, { members_lists: user_id }],
        });

        res.status(200).json({ teams });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user teams', error });
    }
};
