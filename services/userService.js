import { executeQuery } from "../database/database.js";
import { hash } from "../deps.js";

const addUser = async(email, password) => {
    const pw = await hash(password);
    await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, pw);
}

const hasEmail = async(email) => {
    const res = await executeQuery("SELECT email FROM users WHERE email=$1;", email);
    return (res.rowCount > 0);
}

const getUser = async(email) => {
    const res = await executeQuery("SELECT * FROM users WHERE email=$1", email);
    if (res.rowCount == 0) {
        return null;
    }
    return res.rowsOfObjects()[0];
}

const clearUsers = async() => {
    await executeQuery("DELETE FROM users;");
}

const resetUserIds = async() => {
    await executeQuery("ALTER SEQUENCE users_id_seq RESTART WITH 1");
}

export { addUser, hasEmail, getUser, clearUsers, resetUserIds } ;