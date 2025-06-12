"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../helpers/authentication");
const multer_1 = require("../utils/multer");
const calendarEventController_1 = require("../controllers/calendarEventController");
const userController_1 = require("../controllers/userController");
const taskController_1 = require("../controllers/taskController");
const teamController_1 = require("../controllers/teamController");
const router = express_1.default.Router();
//user routes
router.post('/signup', userController_1.registerUser);
router.post('/login', userController_1.loginUser);
router.post('/logout', userController_1.logoutUser);
router.get('/id', userController_1.getUserById);
router.get('/allUserInfo', userController_1.getAllUser);
router.get('/profile', authentication_1.authenticateToken, userController_1.getUserProfile);
router.post('/uploadProfilePicture', authentication_1.authenticateToken, multer_1.upload.single('profilePic'), userController_1.uploadProfilePicture);
router.post('/uploadCoverPicture', authentication_1.authenticateToken, multer_1.upload.single('coverPic'), userController_1.uploadCoverPicture);
router.put('/updateUser', authentication_1.authenticateToken, userController_1.updateUser);
// task routes
router.post('/addTask', authentication_1.authenticateToken, taskController_1.addTask);
router.get('/getTasks', authentication_1.authenticateToken, taskController_1.getTasks);
router.delete('/deleteTask/:id', authentication_1.authenticateToken, taskController_1.deleteTask);
router.put('/updateTask/:id', authentication_1.authenticateToken, taskController_1.updateTask);
// event routes
router.post('/events', authentication_1.authenticateToken, calendarEventController_1.addEvent);
router.get('/events', authentication_1.authenticateToken, calendarEventController_1.getEvents);
router.put('/events/:eventId', authentication_1.authenticateToken, calendarEventController_1.updateEvent);
router.delete('/events/:eventId', authentication_1.authenticateToken, calendarEventController_1.deleteEvent);
// team routes
router.post('/addTeamTask', authentication_1.authenticateToken, teamController_1.addTeamTasks);
router.post('/createTeam', authentication_1.authenticateToken, teamController_1.createTeam);
router.post('/inviteMember', authentication_1.authenticateToken, teamController_1.sendTeamInvitation);
router.post('/respondToInvitation', authentication_1.authenticateToken, teamController_1.respondToInvitation);
router.post('/requestToJoinTeam', authentication_1.authenticateToken, teamController_1.requestToJoinTeam);
router.post('/respondToJoinRequest', authentication_1.authenticateToken, teamController_1.respondToJoinRequest);
router.post('/leaveTeam', authentication_1.authenticateToken, teamController_1.leaveTeam);
router.delete('/deleteTeam', authentication_1.authenticateToken, teamController_1.deleteTeam);
router.get('/user-teams', authentication_1.authenticateToken, teamController_1.getUserTeams);
//team tasks routes
router.put('/claimTeamTask', authentication_1.authenticateToken, teamController_1.claimTeamTask);
router.put('/updateTeamTask', authentication_1.authenticateToken, teamController_1.updateTeamTask);
router.delete('/deleteTeamTask', authentication_1.authenticateToken, teamController_1.deleteTeamTask);
exports.default = router;
