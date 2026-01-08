import { Request, ResponseToolkit } from "@hapi/hapi";

export function validationError(request: Request, h: ResponseToolkit, error: Error) {
      console.log(error.message);
  return h.continue;
}
