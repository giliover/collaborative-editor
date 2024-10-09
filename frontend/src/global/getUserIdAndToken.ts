import { jwtDecode } from "jwt-decode";

export const getUserIdAndToken = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("");
  const decodedToken = jwtDecode(token as string) as any;
  return { token, userId: decodedToken.id };
};
