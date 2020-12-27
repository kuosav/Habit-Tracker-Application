import { getAuthorizedUser } from "../../util/auth.js";
import { validateMorning } from "../../util/validateMorning.js";
import { addMorningData } from "../../services/trackingService.js";

const viewMorning = async({session, response, render}) => {
    const auth = await getAuthorizedUser(session);
    if (auth) {
        render('morning.ejs', { date: new Date().toISOString().substr(0, 10),
                                sleepDuration: 0.0,
                                sleepQuality: null,
                                mood: null,
                                errors: null,
                                auth: auth.email});
    } else {
        response.redirect('/auth/login');
    }
}

const postMorning = async({request, session, response, render}) => {
    const auth = await getAuthorizedUser(session);
    if (!auth) {
        response.redirect('/auth/login');
        return;
    }
    const data = await validateMorning(request);
    if (data.errors === null) {
        await addMorningData(data.sleepDuration, data.sleepQuality, data.mood, auth.id, data.date);
        response.redirect('/behavior/reporting');
    } else {
        data.auth = auth.email;
        render('morning.ejs', data);
    }
}

export { viewMorning, postMorning };