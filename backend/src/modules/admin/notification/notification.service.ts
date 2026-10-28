import * as Repository from "./notification.repository.js";

export const getNotifications = async () => {
  return Repository.getNotifications();
};