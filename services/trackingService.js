import { executeQuery } from "../database/database.js";

const hasData = async(date, id) => {
    const res = await executeQuery("SELECT * FROM tracking WHERE date = $1 AND user_id = $2;", date, id);
    return (res && res.rowCount > 0);
}

/*to give a non-null average for a daily mood even with incomplete data, when data is added for a new date,
the evening/morning mood is set for both morning and evening. It gives desired results, since morning or
evening moods are never shown separately.*/

const addMorningData = async(sleepDuration, sleepQuality, mood, userId, date) => {
    if (await hasData(date, userId)) {
        await executeQuery("UPDATE tracking SET sleep_duration = $1, sleep_quality = $2, morning_mood = $3\
                            WHERE user_id = $4 AND date = $5", sleepDuration, sleepQuality, mood, userId, date);
    } else {
        await executeQuery("INSERT INTO tracking (sleep_duration, sleep_quality, morning_mood, evening_mood, user_id, date)\
                            VALUES ($1, $2, $3, $3, $4, $5);", sleepDuration, sleepQuality, mood, userId, date);
    }
}

const addEveningData = async(studyDuration, sportsDuration, dietRating, mood, userId, date) => {
    if (await hasData(date, userId)) {
        await executeQuery("UPDATE tracking SET study_duration = $1, sports_duration = $2,\
                            diet_rating = $3, evening_mood = $4 WHERE user_id = $5 AND date = $6;",
                            studyDuration, sportsDuration, dietRating, mood, userId, date);
    } else {
        await executeQuery("INSERT INTO tracking (study_duration, sports_duration, diet_rating,\
                            morning_mood, evening_mood, user_id, date) VALUES ($1, $2, $3, $4, $4, $5, $6);",
                            studyDuration, sportsDuration, dietRating, mood, userId, date);
    }
}

const getDayData = async(date) => {
    return (await executeQuery("SELECT ROUND(AVG(sleep_duration)::numeric,2) AS sleep_duration,\
                                ROUND(AVG(sleep_quality)::numeric,2) AS sleep_quality,\
                                ROUND(((AVG(morning_mood) + AVG(evening_mood)) / 2.0)::numeric,2) AS mood,\
                                ROUND(AVG(sports_duration)::numeric,2) AS sports_duration,\
                                ROUND(AVG(study_duration)::numeric,2) AS study_duration,\
                                ROUND(AVG(diet_rating)::numeric,2) AS diet_rating\
                                FROM tracking WHERE date = $1;", date)).rowsOfObjects()[0];
}

const getPersonalDayData = async(date, id) => {
    return (await executeQuery("SELECT sleep_duration, sleep_quality, ROUND(((morning_mood + evening_mood) / 2)::numeric,2)\
                                AS mood, sports_duration, study_duration, diet_rating FROM tracking WHERE date = $1 AND user_id = $2;", date, id)).rowsOfObjects()[0];
}

const getWeekSummary = async(week, year, id) => {
    return (await executeQuery("SELECT ROUND(AVG(sleep_duration)::numeric,2) AS sleep_duration,\
                                ROUND(AVG(sleep_quality)::numeric,2) AS sleep_quality,\
                                ROUND(((AVG(morning_mood) + AVG(evening_mood)) / 2.0)::numeric,2) AS mood,\
                                ROUND(AVG(sports_duration)::numeric,2) AS sports_duration,\
                                ROUND(AVG(study_duration)::numeric,2) AS study_duration,\
                                ROUND(AVG(diet_rating)::numeric,2) AS diet_rating\
                                FROM tracking WHERE date_part('week', date) = $1 AND date_part('year', date) = $2\
                                AND user_id = $3;", week, year, id)).rowsOfObjects()[0];
}

const getMonthSummary = async(month, year, id) => {
    return (await executeQuery("SELECT ROUND(AVG(sleep_duration)::numeric,2) AS sleep_duration,\
                                ROUND(AVG(sleep_quality)::numeric,2) AS sleep_quality,\
                                ROUND(((AVG(morning_mood) + AVG(evening_mood)) / 2.0)::numeric,2) AS mood,\
                                ROUND(AVG(sports_duration)::numeric,2) AS sports_duration,\
                                ROUND(AVG(study_duration)::numeric,2) AS study_duration,\
                                ROUND(AVG(diet_rating)::numeric,2) AS diet_rating\
                                FROM tracking WHERE date_part('month', date) = $1 AND date_part('year', date) = $2\
                                AND user_id = $3;", month, year, id)).rowsOfObjects()[0];
}

const getSummaryBetween = async(startDate, endDate) => {
    return (await executeQuery("SELECT ROUND(AVG(sleep_duration)::numeric,2) AS sleep_duration,\
                                ROUND(AVG(sleep_quality)::numeric,2) AS sleep_quality,\
                                ROUND(((AVG(morning_mood) + AVG(evening_mood)) / 2.0)::numeric,2) AS mood,\
                                ROUND(AVG(sports_duration)::numeric,2) AS sports_duration,\
                                ROUND(AVG(study_duration)::numeric,2) AS study_duration,\
                                ROUND(AVG(diet_rating)::numeric,2) AS diet_rating\
                                FROM tracking WHERE date BETWEEN $1 AND $2;", startDate, endDate)).rowsOfObjects()[0];
}

const getAvgMood = async(date) => {
    const res = await executeQuery("SELECT ROUND(((AVG(morning_mood) + AVG(evening_mood)) / 2.0)::numeric,2)\
                                    AS mood FROM tracking WHERE date = $1;", date);
    
    if (res && res.rowCount > 0) {
        return res.rowsOfObjects()[0].mood;
    } else {
        return null;
    }
}

const clearTracking = async() => {
    await executeQuery("DELETE FROM tracking;");
}

export {hasData, addMorningData, addEveningData, getDayData, getPersonalDayData, getWeekSummary, getMonthSummary, getSummaryBetween, getAvgMood, clearTracking};