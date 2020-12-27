import { validateParams } from "../../util/validateLogin.js";
import { authorize, unauthorize } from "../../util/auth.js";


const viewLogin = ({render}) => {
    render('login.ejs', {success: true});
}

/* attemtpts login. If user can successfully log in, they get redirected to /behavior/reporting.
Otherwise, the login page is shown with an error message. */
const attemptLogin = async({request, session, response, render}) => {
    const validatedParams = await validateParams(request);
    if (validatedParams !== null) {
        await authorize(session, validatedParams.id, validatedParams.email);
        response.redirect('/behavior/reporting');
    } else {
        render('login.ejs', {success: false});
    }
}

const logOut = async({session, response}) => {
    await unauthorize(session);
    response.redirect('/auth/login');
}

export { viewLogin, attemptLogin, logOut };