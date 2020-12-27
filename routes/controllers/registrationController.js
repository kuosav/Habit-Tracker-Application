import { validateRegistration } from "../../util/validateRegistration.js";
import { addUser, getUser } from "../../services/userService.js";
import { authorize } from "../../util/auth.js";

const viewRegistration = async({render}) => {
    render('registration.ejs', {email: "",
                                password: "",
                                passwordValidation: "",
                                errors: null });
}

const addRegistration = async({session, request, response, render}) => {
    const data = await validateRegistration(request);
    if (data.errors !== null) {
        render('registration.ejs', data);
    } else {
        await addUser(data.email, data.password);
        await authorize(session, (await getUser(data.email)).id, data.email);
        response.redirect('/behavior/reporting');
    }
};

export { viewRegistration, addRegistration };