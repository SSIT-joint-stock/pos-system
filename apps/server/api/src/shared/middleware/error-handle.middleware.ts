import {
  BadRequestError,
  InternalServerError,
  BaseClientError,
  BaseServerError,
} from "@repo/types/response";

import type { Request, Response, NextFunction } from "express";

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next();
  }

  try {
    if (err instanceof SyntaxError && "body" in err) {
      console.error("Bad JSON:", err.message);
      throw new BadRequestError("Invalid body format", "invalid_body_format");
    }
  } catch (error) {
    console.log("error", error);
    return reportCustomError(error, res);
  }

  if (err instanceof BaseClientError || err instanceof BaseServerError) {
    return reportCustomError(err, res);
  }

  if ("message" in err && err.message === "Route not found") {
    return res.status(404).send("Route not found").end();
  }

  if ("message" in err) {
    console.log("err", err.message);
  } else {
    console.log("err", err);
  }

  next(err);
  return reportCustomError(
    new InternalServerError("Internal Server Error", "internal_server_error"),
    res
  );
};

const reportCustomError = (
  err: BaseClientError | BaseServerError,
  res: Response
) => {
  const { statusCode = 500 } = err;
  const response = err.toResponse();
  return res
    .status(statusCode)
    .json(response)
    .end();
};
