import { Request, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";

export default async function failActionFn(
  request: Request,
  h: ResponseToolkit,
  err: Error | undefined
) {
  const validationError = err as Joi.ValidationError;

  let errors: string | { field?: string; message: string }[] = "unknown error";

  if (validationError.isJoi) {
    errors = validationError.details.map((detail) => ({
      field: detail.context?.key,
      message: `Field ${detail.message}`,
    }));
  }

  return h.response({ errors }).code(400).takeover();
}
