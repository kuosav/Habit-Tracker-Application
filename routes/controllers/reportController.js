import { getAuthorizedUser } from "../../util/auth.js";
import { getPersonalDayData } from "../../services/trackingService.js";

const viewReport = async({session, response, render}) => {
    const auth = await getAuthorizedUser(session);
    if (auth) {
        const dayData = await getPersonalDayData(new Date().toISOString().substr(0, 10), auth.id);
        console.log(dayData);
        //morning data has not been added if any of the morning-only attributes is null
        const hasMorning = (dayData && dayData.sleep_quality != null);
        //evening data has not been added if any of the evening-only attributes is null
        const hasEvening = (dayData && dayData.sports_duration != null);

        render('report.ejs', {morning: hasMorning, evening: hasEvening, auth: auth.email});
    } else {
        response.redirect('/auth/login');
    }
}

export { viewReport };