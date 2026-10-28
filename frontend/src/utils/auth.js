export const logoutUser = () => {
  localStorage.removeItem("auth_token");

  localStorage.removeItem("refresh_token");
};