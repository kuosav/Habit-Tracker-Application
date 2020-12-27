import { assertEquals } from "../deps.js";
import { addUser, clearUsers, resetUserIds } from "../services/userService.js";
import { validateParams } from "../util/validateLogin.js";

//make sure users table is reseted
await clearUsers();
await resetUserIds();

Deno.test({
    name: "LOGIN validation should return an error due to a wrong email", 
    async fn() {
        
        const wrongEmail = () => {
            const value = new Map();
            value.set('email', 'wrong@email.com');
            value.set('password', 'test');
            return { value: value };
        }

        const request = {
            body: wrongEmail
        }
        
        assertEquals(await validateParams(request), null);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "LOGIN validation should return an error due to a wrong password", 
    async fn() {
        
        const wrongPassword = () => {
            const value = new Map();
            value.set('email', 'is@email.com');
            value.set('password', 'notTest');
            return { value: value };
        }

        const request = {
            body: wrongPassword
        }
        
        assertEquals(await validateParams(request), null);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "LOGIN validation should return correct email", 
    async fn() {
        
        const validLogin = () => {
            const value = new Map();
            value.set('email', 'new@email.com');
            value.set('password', 'test');
            return { value: value };
        }

        const request = {
            body: validLogin
        }
        
        await addUser('new@email.com', 'test');
        
        assertEquals((await validateParams(request)).email, 'new@email.com');
    },
    sanitizeResources: false,
    sanitizeOps: false
});