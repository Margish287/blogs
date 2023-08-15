import { getUserQuery } from "../modal/user.js";

export const validateUserDetails = ({
  username = "",
  password = "",
  email = "",
}) => {
  const usernameRegex = /[A-Za-z][A-Za-z0-9_]{7,20}/; // testuser1
  const emailRegex = /^[a-z]{3,20}[0-9]{0,4}@[a-z]{3,7}.[a-z]{2,3}/; // testuser1@gmail.com
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/; // testuserpass1

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

  if (!email.match(emailRegex)) {
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
    message: "User data is valid",
    isValidUser: true,
  };
};

export const validateUpdateUserDetails = (userObj) => {
  console.log(userObj);
};

export const checkIfUserIsAlreadyExist = async (userObj) => {
  let user = null;
  if (username && email) {
    user = await getUserQuery({ email, username });
  } else if (email) {
    user = await getUserQuery({ email });
  } else if (username) {
    user = await getUserQuery({ username });
  }

  return user ? true : false;
};
