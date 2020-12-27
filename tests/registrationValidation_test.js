import { assertEquals } from "../deps.js";
import { addUser, clearUsers, resetUserIds } from "../services/userService.js";
import { validateRegistration } from "../util/validateRegistration.js";

//make sure users table is reseted
await clearUsers();
await resetUserIds();

Deno.test({
    name: "REGISTRATION validation should return an error for an invalid email", 
    async fn() {
        
        const expectedRes = {
            email: 'notEmail',
            password: '',
            passwordValidation: '',
            errors: {
                email: { isEmail: "email is not a valid email address" }
            }
        }

        const badEmail = () => {
            const value = new Map();
            value.set('email', 'notEmail');
            value.set('password', 'test');
            value.set('passwordValidation', 'test');
            return { value: value };
        }

        const request = {
            body: badEmail
        }
        
        assertEquals(await validateRegistration(request), expectedRes);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "REGISTRATION validation should return an error for unmatched passwords", 
    async fn() {
        
        const expectedRes = {
            email: 'valid@email.com',
            password: '',
            passwordValidation: '',
            errors: {
                verification: { passwords: "the passwords did not match" }
            }
        }
        
        const unmatchedPasswords = () => {
            const value = new Map();
            value.set('email', 'valid@email.com');
            value.set('password', 'test');
            value.set('passwordValidation', 'notTest');
            return { value: value };
        }

        const request = {
            body: unmatchedPasswords
        }
        
        assertEquals(await validateRegistration(request), expectedRes);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "REGISTRATION validation should not return errors", 
    async fn() {
        
        const expectedRes = {
            email: 'is@email.com',
            password: 'test',
            passwordValidation: 'test',
            errors: null
        }
        
        const validParams = () => {
            const value = new Map();
            value.set('email', 'is@email.com');
            value.set('password', 'test');
            value.set('passwordValidation', 'test');
            return { value: value };
        }

        const request = {
            body: validParams
        }
        
        assertEquals(await validateRegistration(request), expectedRes);
    },
    sanitizeResources: false,
    sanitizeOps: false
});


Deno.test({
    name: "REGISTRATION validation should return an error for trying to register with the same email address", 
    async fn() {
        
        const expectedRes = {
            email: 'is@email.com',
            password: '',
            passwordValidation: '',
            errors: {
                unique_email: { unique: "there is already an account with the same email" }
            }
        }
        
        const takenEmail = () => {
            const value = new Map();
            value.set('email', 'is@email.com');
            value.set('password', 'test');
            value.set('passwordValidation', 'test');
            return { value: value };
        }

        const request = {
            body: takenEmail
        }

        await addUser('is@email.com', 'test');
        
        assertEquals(await validateRegistration(request), expectedRes);
    },
    sanitizeResources: false,
    sanitizeOps: false
});