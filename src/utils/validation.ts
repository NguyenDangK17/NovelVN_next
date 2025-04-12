interface SignupFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const validateSignupForm = ({
  username,
  email,
  password,
  confirmPassword,
}: SignupFormValues) => {
  let isValid = true;
  const newErrors: { [key: string]: string } = {};

  if (!username.trim()) {
    newErrors.username = "Username is required.";
    isValid = false;
  }
  if (!email.trim()) {
    newErrors.email = "Email is required.";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    newErrors.email = "Invalid email format.";
    isValid = false;
  }
  if (!password) {
    newErrors.password = "Password is required.";
    isValid = false;
  } else if (password.length < 6) {
    newErrors.password = "Password must be at least 6 characters.";
    isValid = false;
  }
  if (!confirmPassword) {
    newErrors.confirmPassword = "Please confirm your password.";
    isValid = false;
  } else if (password !== confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match.";
    isValid = false;
  }

  return { isValid, newErrors };
};