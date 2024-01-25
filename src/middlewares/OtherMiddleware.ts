import { type Response, type Request, type NextFunction } from "express";
import { type Profile, SuperfaceClient } from "@superfaceai/one-sdk";
import logger from "../utils/logger";

class OtherMiddleware {
  static addCustomHeader = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    res.setHeader("customHeader", "X-myCustomHeader");
    next();
  };

  static Logger = (req: Request, res: Response, next: NextFunction): void => {
    logger.log("info", `Method is ${req.method}, Urls is ${req.originalUrl}`);
    next();
  };
}

export default OtherMiddleware;
