import { User } from "../types/user";

export const updateUser = (
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  setUser(user);
  localStorage.setItem("user", JSON.stringify(user));
};