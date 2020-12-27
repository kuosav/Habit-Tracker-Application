import { getAuthorizedUser } from "../../util/auth.js";
import { getWeekSummary, getMonthSummary } from "../../services/trackingService.js";


Date.prototype.getWeekNumber = function(){
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};

const today = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// week averages
let w = today.getWeekNumber(); //default
let weekData = null;

// month averages
let m = today.getMonth()+1; //default
let monthName = months[m - 1];
let monthData = null;


const updateWeek = async(week, year, id) => {
    weekData = (await getWeekSummary(week, year, id));
    Object.keys(weekData).forEach((key) => {
        if (weekData[key] == null) {
            weekData[key] = 'No data yet';
        }
    });
}

const updateMonth = async(week, year, id) => {
    monthData = (await getMonthSummary(week, year, id));
    Object.keys(monthData).forEach((key) => {
        if (monthData[key] == null) {
            monthData[key] = 'No data yet';
        }
    });
}

/* for variables week and month: if both are undefined, both are updated to be the latest week & month.
If only week is defined, month data stays as it is and week data is updated, and vice versa. If both are
defined, nothing gets updated, because updating both at the same time should not happen. */
const viewSummary = async({session, response, render}, year, week, month) => {

    const auth = await getAuthorizedUser(session);
    if (!auth) {
        response.redirect('/auth/login');
    }

    let useYear = 2020;
    if (year && !isNaN(year)) {
        useYear = year;
    }

    if ((week === 'undefined' || isNaN(week)) && (month === 'undefined' || isNaN(month))) {
        await updateWeek(w, useYear, auth.id);
        await updateMonth(m, useYear, auth.id);
    } else if (week === 'undefined' || isNaN(week)) {
        m = month;
        monthName = months[m - 1];
        await updateMonth(m, useYear, auth.id);
    } else if (month === 'undefined' || isNaN(month)) {
        w = week;
        await updateWeek(w, useYear, auth.id);
    }

    render('summary.ejs', {week: w,
                           weekData: weekData,
                           month: monthName,
                           monthData: monthData,
                           auth: auth.email});
}

const postSummary = async(context) => {
    const body = context.request.body();
    const params = await body.value;
    if (params.has('week')) {
        await viewSummary(context, Number(params.get('week').substring(0, 4)), Number(params.get('week').substring(6)));
    } else if (params.has('month')) {
        await viewSummary(context, Number(params.get('month').substring(0, 4)), undefined, Number(params.get('month').substring(5)));
    } else {
        await viewSummary(context);
    }
}


export { viewSummary, postSummary };