export const emailRegexGenerate = (
  customMessage = "Please enter a valid email address",
) => {
  return {
    regex: new RegExp(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`, "u"),
    message: customMessage,
  };
};

export const phoneRegexGenerate = (
  customMessage = "Please enter a valid phone number",
) => {
  return {
    regex: new RegExp(
      `^[+]?[(]?[0-9]{1,4}[)]?[-\\s.]?[(]?[0-9]{1,3}[)]?[-\\s.]?[0-9]{3,4}[-\\s.]?[0-9]{3,5}$`,
      "u",
    ),
    message: customMessage,
  };
};

export const passwordRegexGenerate = (
  minLength = 8,
  maxLength = 128,
  customMessage = "Password must be 8-128 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
) => {
  return {
    regex: new RegExp(
      `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{${minLength},${maxLength}}$`,
      "u",
    ),
    message: customMessage,
  };
};

export const nameRegexGenerate = (
  customMessage = "Please enter a valid name",
  min = 2,
  max = 50,
) => {
  return {
    regex: new RegExp(`^[a-zA-Z\\s'-]{${min},${max}}$`, "u"),
    message: customMessage,
  };
};
