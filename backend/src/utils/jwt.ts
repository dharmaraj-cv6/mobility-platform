import jwt, {
  SignOptions,
} from "jsonwebtoken";

import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
} from "../config/env.js";

export interface JwtPayload {
  id: number;
  role: string;
}

export const generateToken = (
  payload: JwtPayload
): string => {
  const options: SignOptions = {
    expiresIn:
      JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(
    payload,
    JWT_SECRET,
    options
  );
};

export const verifyToken = (
  token: string
): JwtPayload => {
  return jwt.verify(
    token,
    JWT_SECRET
  ) as JwtPayload;
};