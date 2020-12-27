import { getDayData, getSummaryBetween } from "../../services/trackingService.js";

//summary from all user data for the past 7 days
const getWeekSummary = async({response}) => {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    
    // let res = {
    //     sleepingQuality: null,
    //     sleepingDuration: null,
    //     sportsDuration: null,
    //     studyDuration: null,
    //     eatingQuality: null,
    //     eatingRegularity: null,
    //     mood: null
    // }
    
    const res = (await getSummaryBetween(weekAgo.toISOString().substr(0, 10), today.toISOString().substr(0, 10)));

    response.body = res;
    response.headers = new Headers({ "Content-Type": "application/json" });
}

//summary from all user data for the current day
const getDay = async({params, response}) => {
    const date = new Date(Number(params.year), Number(params.month)-1, Number(params.day)+1);

    // let res = {
    //     sleepingQuality: null,
    //     sleepingDuration: null,
    //     sportsDuration: null,
    //     studyDuration: null,
    //     eatingQuality: null,
    //     eatingRegularity: null,
    //     mood: null
    // }
    const res = (await getDayData(date.toISOString().substr(0, 10)));
    
    response.body = res;
    response.headers = new Headers({ "Content-Type": "application/json" });
}

export { getWeekSummary, getDay };