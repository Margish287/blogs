export const validateUserDetails = ({
  username = "",
  password = "",
  email = "",
}) => {
  const usernameRegex = /[A-Za-z][A-Za-z0-9_]{7,20}/;
  const emailRegex = /^\w{3,20}[0-9]{0,4}@\w{3,7}\.\w{2,3}/;
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  if (!username || !email || !password) {
    return {
      message: "All field is required",
      isValidUser: false,
    };
  }

  if (!username.match(usernameRegex)) {
    return {
      message: "Username is not valid",
      isValidUser: false,
    };
  }

  if (!username.match(emailRegex)) {
    return {
      message: "Email is not valid",
      isValidUser: false,
    };
  }

  if (!password.match(passwordRegex)) {
    return {
      message: "Password is not valid",
      isValidUser: false,
    };
  }

  return {
    message: "User data is valide",
    isValidUser: true,
  };
};
