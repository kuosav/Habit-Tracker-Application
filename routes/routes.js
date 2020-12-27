import { Router } from "../deps.js";
import { viewRegistration, addRegistration } from "./controllers/registrationController.js";
import { viewLogin, attemptLogin, logOut } from "./controllers/loginController.js";
import { viewReport } from "./controllers/reportController.js";
import { viewMorning, postMorning } from "./controllers/morningController.js";
import { viewEvening, postEvening } from "./controllers/eveningController.js";
import { viewSummary, postSummary } from "./controllers/summaryController.js";
import { viewFrontpage } from "./controllers/frontpageController.js";
import { getWeekSummary, getDay } from "./apis/summaryAPI.js";

const router = new Router();

//available without an account
router.get('/', viewFrontpage);
router.get('/auth/registration', viewRegistration);
router.post('/auth/registration', addRegistration);
router.get('/auth/login', viewLogin);
router.post('/auth/login', attemptLogin);

//available with an account
router.get('/behavior/reporting', viewReport);
router.get('/behavior/reporting/morning', viewMorning);
router.post('/behavior/reporting/morning', postMorning);
router.get('/behavior/reporting/evening', viewEvening);
router.post('/behavior/reporting/evening', postEvening);
router.get('/behavior/summary', viewSummary);
router.post('/behavior/summary', postSummary);
router.post('/auth/logout', logOut);

//apis
router.get('/api/summary', getWeekSummary);
router.get('/api/summary/:year/:month/:day', getDay);

export { router };