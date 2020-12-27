
let config = {};

config.concurrentConnections = 5;

config.database = {
    hostname: Deno.env.get('PGHOST'),
    database: Deno.env.get('PGDATABASE'),
    user: Deno.env.get('PGDATABASE'),
    password: Deno.env.get('PGPASSWORD'),
    port: 5432
};

config.port = 7777;

// configurations for heroku:

// if (Deno.env.get('TEST_ENVIRONMENT')) {
//     console.log('test environment');
//     config.database = {
//         hostname: Deno.env.get('PGHOST'),
//         database: Deno.env.get('PGDATABASE'),
//         user: Deno.env.get('PGDATABASE'),
//         password: Deno.env.get('PGPASSWORD'),
//         port: 5432
//     };
// } else {
//     config.database = Deno.env.toObject().DATABASE_URL;
//     config.port = 7777;
//     if (Deno.args.length > 0) {
//         const lastArgument = Deno.args[Deno.args.length - 1];
//         config.port = Number(lastArgument);
//     }
// }

export { config }; 