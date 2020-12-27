import { Application } from "./deps.js";
import { viewEngine, engineFactory, adapterFactory } from "./deps.js";
import { Session } from "./deps.js";
import { oakCors } from "./deps.js";
import { router } from "./routes/routes.js";
import { errorMiddleware, timingMiddleware, staticFilesMiddleware } from './middlewares/middlewares.js';
import { config } from "./config/config.js";

const app = new Application();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views"
}));

const session = new Session({ framework: "oak" });
await session.init();
app.use(session.use()(session));

app.use(errorMiddleware);
app.use(timingMiddleware);
app.use(staticFilesMiddleware);

app.use(router.routes());
app.use(oakCors());

let port = config.port;

if (!Deno.env.get('TEST_ENVIRONMENT')) {
    app.listen({ port });
}

export default app;