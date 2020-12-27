import { validate, required, minLength, isEmail } from "../deps.js";
import { hasEmail } from "../services/userService.js";

const validationRules = {
  email: [required, isEmail],
  password: [required, minLength(4)],
  passwordValidation: [required]
};

const getRegistrationData = async(request) => {
  const body = request.body();
  const params = await body.value;
  
  const data = {
    email: params.get('email'),
    password: params.get('password'),
    passwordValidation: params.get('passwordValidation'),
    errors: null
  };
  return data;
}

const validateRegistration = async(request) => {
  const data = await getRegistrationData(request);
  let [passes, errors] = await validate(data, validationRules);

  if (data.password !== data.passwordValidation) {
    errors.verification = { passwords: 'the passwords did not match' };
    passes = false;
  }
  if (await hasEmail(data.email)) {
    errors.unique_email = { unique: 'there is already an account with the same email'};
    passes = false;
  }

  if (!passes) {
    data.errors = errors;
    data.password = '';
    data.passwordValidation = '';
  }
  return data;
}

export { validateRegistration };