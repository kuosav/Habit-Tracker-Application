import { send } from '../deps.js';
import { getAuthorizedUser } from '../util/auth.js';

const errorMiddleware = async(context, next) => {
    try {
        await next();
    } catch (e) {
        console.log(e);
    }
}

const timingMiddleware = async({ session, request }, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;

    const user = await getAuthorizedUser(session);
    let id = 'anonymous';
    if (user) {
        id = user.id;
    }

    console.log(`${request.method} ${request.url.pathname} - ${ms} ms - user id ${id}`);
}

const staticFilesMiddleware = async(context, next) => {
    if (context.request.url.pathname.startsWith('/static')) {
        const path = context.request.url.pathname.substring(7);

        await send(context, path, {
        root: `${Deno.cwd()}/static`
        });
    
    } else {
        await next();
    }
}

export { errorMiddleware, timingMiddleware, staticFilesMiddleware };