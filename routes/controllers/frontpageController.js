import { getAvgMood } from "../../services/trackingService.js";
import { getAuthorizedUser } from "../../util/auth.js";

const viewFrontpage = async({session, render}) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayAvg     = await getAvgMood(today.toISOString().substr(0, 10));
    const yesterdayAvg = await getAvgMood(yesterday.toISOString().substr(0, 10));
    
    const user = await getAuthorizedUser(session);
    if (user) {
        render('frontpage.ejs', {today: todayAvg, yesterday: yesterdayAvg, auth: user.email});
    } else {
        render('frontpage.ejs', {today: todayAvg, yesterday: yesterdayAvg});
    }
}

export { viewFrontpage };