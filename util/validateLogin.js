import { compare } from "../deps.js";
import { getUser } from "../services/userService.js";

//returns id and email if login parameters are valid (= user can log in)
const validateParams = async(request) => {
    const body = request.body();
    const params = await body.value;

    if (params.has('email') && params.has('password')) {
        const user = await getUser(params.get('email'));
        if (!user) {
            return null;
        }
        const match = await compare(params.get('password'), user.password);
        if (match) {
            return {id: user.id, email: params.get('email')};
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export { validateParams };