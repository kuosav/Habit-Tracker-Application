import { assertEquals } from "../deps.js";
import { validateMorning } from "../util/validateMorning.js";

Deno.test({
    name: "MORNING validation should return an error for reporting more than 24 hours of sleep for one day", 
    async fn() {
        
        const expectedRes = {
            date: '2020-12-11',
            sleepDuration: 25,
            sleepQuality: 5,
            mood: 5,
            errors: {
                sleepDuration: { numberBetween: "25 must be between 0 - 24" }
            }
        }
        
        const sleptForTooLong = () => {
            const value = new Map();
            value.set('date', '2020-12-11');
            value.set('sleepDuration', 25);
            value.set('sleepQuality', 5);
            value.set('mood', 5);
            return { value: value };
        }

        const request = {
            body: sleptForTooLong
        }
        
        assertEquals(await validateMorning(request), expectedRes);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "MORNING validation should return multiple error messages in case of multiple errors", 
    async fn() {
        
        const expectedRes = {
            date: '2020-12-11-10',
            sleepDuration: 25,
            sleepQuality: 5,
            mood: 5,
            errors: {
                date: { isDate: 'date is invalid'},
                sleepDuration: { numberBetween: '25 must be between 0 - 24' }
            }
        }
        
        const badDateAndSleep = () => {
            const value = new Map();
            value.set('date', '2020-12-11-10');
            value.set('sleepDuration', 25);
            value.set('sleepQuality', 5);
            value.set('mood', 5);
            return { value: value };
        }

        const request = {
            body: badDateAndSleep
        }
        
        assertEquals(await validateMorning(request), expectedRes);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "MORNING validation should not accept negative values", 
    async fn() {
        
        const expectedRes = {
            date: '2020-12-11',
            sleepDuration: -10,
            sleepQuality: -5,
            mood: -1,
            errors: {
                sleepDuration: { numberBetween: '-10 must be between 0 - 24' },
                sleepQuality: { numberBetween: '-5 must be between 1 - 5' },
                mood: { numberBetween: '-1 must be between 1 - 5' }
            }
        }
        
        const negativity = () => {
            const value = new Map();
            value.set('date', '2020-12-11');
            value.set('sleepDuration', -10);
            value.set('sleepQuality', -5);
            value.set('mood', -1);
            return { value: value };
        }

        const request = {
            body: negativity
        }
        
        assertEquals(await validateMorning(request), expectedRes);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "MORNING validation should not return any errors for a valid input", 
    async fn() {
        
        const expectedRes = {
            date: '2020-12-11',
            sleepDuration: 10,
            sleepQuality: 3,
            mood: 3,
            errors: null
        }
        
        const validParams = () => {
            const value = new Map();
            value.set('date', '2020-12-11');
            value.set('sleepDuration', 10);
            value.set('sleepQuality', 3);
            value.set('mood', 3);
            return { value: value };
        }

        const request = {
            body: validParams
        }
        
        assertEquals(await validateMorning(request), expectedRes);
    },
    sanitizeResources: false,
    sanitizeOps: false
});