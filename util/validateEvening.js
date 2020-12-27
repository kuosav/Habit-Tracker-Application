import { validate, required, numberBetween, isDate, isInt } from "../deps.js";

const validationRules = {
    date: [required, isDate],
    sportsDuration: [required, numberBetween(0, 24)],
    studyDuration: [required, numberBetween(0, 24)],
    dietRating: [required, isInt, numberBetween(1, 5)],
    mood: [required, isInt, numberBetween(1, 5)]
};

const getEveningData = async(request) => {
    const body = request.body();
    const params = await body.value;
    const data = {
        date: params.get('date'),
        sportsDuration: Number(params.get('sportsDuration')),
        studyDuration: Number(params.get('studyDuration')),
        dietRating: Number(params.get('dietRating')),
        mood: Number(params.get('mood')),
        errors: null
    };
    return data;
}

const validateEvening = async(request) => {
    const data = await getEveningData(request);
    let [passes, errors] = await validate(data, validationRules);
    if (!passes) {
        data.errors = errors;
    }
    return data;
}

export { validateEvening };