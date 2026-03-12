import { HttpStatusCode } from "axios";

export type APIFailureData = {
  message: string;
  error: string;
  statusCode?: HttpStatusCode;
};
