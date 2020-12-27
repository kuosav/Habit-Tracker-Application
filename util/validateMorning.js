import { validate, required, numberBetween, isDate, isInt } from "../deps.js";

const validationRules = {
    date: [required, isDate],
    sleepDuration: [required, numberBetween(0, 24)],
    sleepQuality: [required, isInt, numberBetween(1, 5)],
    mood: [required, isInt, numberBetween(1, 5)]
};

const getMorningData = async(request) => {
    const body = request.body();
    const params = await body.value;
    const data = {
        date: params.get('date'),
        sleepDuration: Number(params.get('sleepDuration')),
        sleepQuality: Number(params.get('sleepQuality')),
        mood: Number(params.get('mood')),
        errors: null
    };
    return data;
}

const validateMorning = async(request) => {
    const data = await getMorningData(request);

    let [passes, errors] = await validate(data, validationRules);
    if (!passes) {
        data.errors = errors;
    }
    return data;
}

export { validateMorning };