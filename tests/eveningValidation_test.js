import { assertEquals } from "../deps.js";
import { validateEvening } from "../util/validateEvening.js";


Deno.test({
    name: "EVENING validation should return an error for reporting more than 24 hours any activity for one day", 
    async fn() {
        
        const expectedRes = {
            date: '2020-12-11',
            sportsDuration: 25,
            studyDuration: 100,
            dietRating: 5,
            mood: 5,
            errors: {
                sportsDuration: { numberBetween: '25 must be between 0 - 24' },
                studyDuration: { numberBetween: '100 must be between 0 - 24' }
            }
        }
        
        const tooMuchWork = () => {
            const value = new Map();
            value.set('date', '2020-12-11');
            value.set('sportsDuration', 25);
            value.set('studyDuration', 100);
            value.set('dietRating', 5);
            value.set('mood', 5);
            return { value: value };
        }

        const request = {
            body: tooMuchWork
        }
        
        assertEquals(await validateEvening(request), expectedRes);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "EVENING validation should return multiple error messages in case of multiple errors", 
    async fn() {
        
        const expectedRes = {
            date: '2020-12-11-10',
            sportsDuration: 3,
            studyDuration: 2,
            dietRating: 5,
            mood: 0,
            errors: {
                date: { isDate: 'date is invalid' },
                mood: { numberBetween: '0 must be between 1 - 5' }
            }
        }
        
        const multipleFaults = () => {
            const value = new Map();
            value.set('date', '2020-12-11-10');
            value.set('sportsDuration', 3);
            value.set('studyDuration', 2);
            value.set('dietRating', 5);
            value.set('mood', 0);
            return { value: value };
        }

        const request = {
            body: multipleFaults
        }
        
        assertEquals(await validateEvening(request), expectedRes);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "EVENING validation should not accept negative values", 
    async fn() {
        
        const expectedRes = {
            date: '2020-12-11',
            sportsDuration: -3,
            studyDuration: -2,
            dietRating: -5,
            mood: -1,
            errors: {
                sportsDuration: { numberBetween: '-3 must be between 0 - 24' },
                studyDuration: { numberBetween: '-2 must be between 0 - 24' },
                dietRating: { numberBetween: '-5 must be between 1 - 5' },
                mood: { numberBetween: '-1 must be between 1 - 5' }
            }
        }
        
        const negativity = () => {
            const value = new Map();
            value.set('date', '2020-12-11');
            value.set('sportsDuration', -3);
            value.set('studyDuration', -2);
            value.set('dietRating', -5);
            value.set('mood', -1);
            return { value: value };
        }

        const request = {
            body: negativity
        }
        
        assertEquals(await validateEvening(request), expectedRes);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "EVENING validation should not return any errors for a valid input", 
    async fn() {
        
        const expectedRes = {
            date: '2020-12-11',
            sportsDuration: 0,
            studyDuration: 2,
            dietRating: 4,
            mood: 1,
            errors: null
        }
        
        const validParams = () => {
            const value = new Map();
            value.set('date', '2020-12-11');
            value.set('sportsDuration', 0);
            value.set('studyDuration', 2);
            value.set('dietRating', 4);
            value.set('mood', 1);
            return { value: value };
        }

        const request = {
            body: validParams
        }
        
        assertEquals(await validateEvening(request), expectedRes);
    },
    sanitizeResources: false,
    sanitizeOps: false
});