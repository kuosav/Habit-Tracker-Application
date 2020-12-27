import { superoak } from "../deps.js";
import { addUser, clearUsers, resetUserIds } from "../services/userService.js";
import { addMorningData, addEveningData, clearTracking } from "../services/trackingService.js";
import app from "../app.js";

//make sure all tables are empty and userID's start from 1
await clearUsers();
await clearTracking();
await resetUserIds();

Deno.test({
    name: "GET request to /api/summary should successfully return a json document", 
    async fn() {
        const testClient = await superoak(app);
        const res = await testClient.get("/api/summary").expect(200).expect('Content-Type', new RegExp('application/json'));
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "GET request to /api/summary/2020/12/10 should successfully return a json document", 
    async fn() {
        const testClient = await superoak(app);
        const res = await testClient.get("/api/summary/2020/12/12").expect(200).expect('Content-Type', new RegExp('application/json'));
    },
    sanitizeResources: false,
    sanitizeOps: false
});

const today = new Date().toISOString().substr(0, 10);
const yearT = today.substring(0, 4);
const monthT = today.substring(5, 7);
const dayT = today.substring(8, 10);

const yesterdayDate = new Date();
yesterdayDate.setDate(yesterdayDate.getDate() - 1);
const yesterday = yesterdayDate.toISOString().substr(0, 10);
const yearY = yesterday.substring(0, 4);
const monthY = yesterday.substring(5, 7);
const dayY = yesterday.substring(8, 10);

Deno.test({
    name: "GET request to /api/summary should return correct averages", 
    async fn() {
        const expectedRes = {
            sleep_duration: '10.00',
            sleep_quality: '5.00',
            mood: '3.00',
            sports_duration: '6.00',
            study_duration: '2.00',
            diet_rating: '4.00'
        }

        //add data
        await addUser("test@test.com", "test"); //id = 1
        await addMorningData(10, 5, 5, 1, today);
        await addEveningData(2, 6, 4, 1, 1, today);

        const testClient = await superoak(app);
        await testClient.get("/api/summary").expect(200).expect(expectedRes);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: `GET request to /api/summary/${yearT}/${monthT}/${dayT} should return correct averages`, 
    async fn() {
        const expectedRes = {
            sleep_duration: '10.00',
            sleep_quality: '5.00',
            mood: '3.00',
            sports_duration: '6.00',
            study_duration: '2.00',
            diet_rating: '4.00'
        }

        const testClient = await superoak(app);
        const res = await testClient.get(`/api/summary/${yearT}/${monthT}/${dayT}`).expect(200).expect(expectedRes);
    },
    sanitizeResources: false,
    sanitizeOps: false
});


Deno.test({
    name: "GET request to /api/summary should return correct averages with additional data", 
    async fn() {
        const expectedRes = {
            sleep_duration: '5.00',
            sleep_quality: '3.00',
            mood: '3.00',
            sports_duration: '6.00',
            study_duration: '3.00',
            diet_rating: '3.50'
        }

        //add data
        await addMorningData(0, 1, 5, 1, yesterday);
        await addEveningData(4, 6, 3, 1, 1, yesterday);

        const testClient = await superoak(app);
        await testClient.get("/api/summary").expect(200).expect(expectedRes);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: `GET request to /api/summary/${yearY}/${monthY}/${dayY} should return correct averages 2`, 
    async fn() {
        const expectedRes = {
            sleep_duration: '0.00',
            sleep_quality: '1.00',
            mood: '3.00',
            sports_duration: '6.00',
            study_duration: '4.00',
            diet_rating: '3.00'
        }

        const testClient = await superoak(app);
        const res = await testClient.get(`/api/summary/${yearY}/${monthY}/${dayY}`).expect(200).expect(expectedRes);
    },
    sanitizeResources: false,
    sanitizeOps: false
});