# Tracking application

This web application is available at https://habittrackerapp.herokuapp.com/

This project was made to fulfil the requirements of a web software development course assignment. Therefore, there are some elements (e.g. the week selector) that do not properly work on all browsers. For the best user experience, I suggest using a recent version of Chrome (version 87.0.4280.88 was used at the time of development).

The application can be used to track the duration and quality of sleep, the duration of sports and studying activities, the quality and regularity of eating as well as general mood. Duration is measured in hours, and the quality attributes are rated on a scale from 1 to 5.

## Database

The tracker uses two tables: _users_ for storing user data and _tracking_ for storing the user's habit tracking. You can create the tables and an index for user emails on ElephantSQL using the following queries:

~~~~SQL
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password CHAR(60) NOT NULL
);

CREATE UNIQUE INDEX ON users((lower(email)));

CREATE TABLE tracking (
  date DATE,
  user_id INTEGER,
  sleep_duration DECIMAL,
  sleep_quality INTEGER,
  morning_mood INTEGER,
  evening_mood INTEGER,
  sports_duration DECIMAL,
  study_duration DECIMAL,
  diet_rating INTEGER,
  PRIMARY KEY (date, user_id)
);
~~~~

## Running the application locally

To run the application locally, you need to have Deno installed on your computer. You can start the application by cd'ing your way to the root folder of the application and using the following command: 

PGHOST='yourhost' PGDATABASE='yourdatabase' PGPASSWORD='yourpassword' deno run --allow-env --allow-net --allow-read --unstable app.js

where you replace the parameter values with your own database credentials. It is assumed that your database name and user name are the same.

Note that the configurations are set a bit differently in this version compared to the one that is in Heroku. The Heroku version is commented out in the config file if you wish to check it out. Even though the Procfile is included, it's useless with the current configurations.


## Tests

Running the tests is as simple as running the application. To test the application, use the following command:
 
TEST_ENVIRONMENT=true PGHOST='yourhost' PGDATABASE='yourdatabase' PGPASSWORD='yourpassword' deno test --allow-env --allow-net --allow-read --unstable tests/

where you replace the parameter values with your own database credentials. Again, it is assumed that your database name and user name are the same.

I recommend using a separate database (with the same commands as described in the database section) for testing. The tests should work regardless of the database contents, however they will reset and modify the tables. All the tests _should_ pass.


## Structure

Pages that can be accessed with/without an account:
  * / - the landing page - briefly describes the application, shows average moods for today and yesterday, contains a motivational sentence and buttons for reporting data, login and registration
  * /auth/registration - the registration page
  * /auth/login - the login page. Contains a login form and a button for registration

APIs (accessible by everyone, allow cross-origin requests)
  * /api/summary - responds with a json document with averages for the past 7 days
  * api/summary/:year/:month/:day - responds with a json document with averages for that day
  

Pages that can be accessed only with an account:
  * /behavior/reporting - contains buttons for reporting morning and evening behavior, as well as a button that leads to the summary page
  * /behavior/reporting/morning - contains a form for submitting morning data
  * /behavior/reporting/evening - contains a form for submitting evening data
  * /behavior/summary - contains summaries for one week and one month (current ones by default) and forms that can be used to select another week or month. If there is not enough data, the page states that there is not enough data for the averages.


## Clarifications

* the ejs files use unescaped raw output tags (<%- ... %>) for including partials only.
* the landing page shows averages only if there is data for those days. The cheer-up sentence is shown if there is data for both days.
* all pages that are accessed with an account have the user's email and a logout button.