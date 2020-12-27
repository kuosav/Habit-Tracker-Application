import { getAuthorizedUser } from "../../util/auth.js";
import { validateEvening } from "../../util/validateEvening.js";
import { addEveningData } from "../../services/trackingService.js";

const viewEvening = async({session, response, render}) => {
    const auth = await getAuthorizedUser(session);
    if (auth) {
        render('evening.ejs', { date: new Date().toISOString().substr(0, 10),
                                sportsDuration: 0.0,
                                studyDuration: 0.0,
                                dietRating: null,
                                mood: null,
                                errors: null,
                                auth: auth.email});
    } else {
        response.redirect('/auth/login');
    }
}

const postEvening = async({request, session, response, render}) => {
    const auth = await getAuthorizedUser(session);
    if (!auth) {
        response.redirect('/auth/login');
        return;
    }
    const data = await validateEvening(request);
    if (data.errors === null) {
        await addEveningData(data.sportsDuration, data.studyDuration, data.dietRating, data.mood, auth.id, data.date);
        response.redirect('/behavior/reporting');
    } else {
        data.auth = auth.email;
        render('evening.ejs', data);
    }
}

export { viewEvening, postEvening };