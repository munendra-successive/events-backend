import { type NextFunction, type Request, type Response } from "express";
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from "jsonwebtoken";
import serverConfig from "../../../config";
import logger from "../../../utils/logger";
import SystemResponse from "../../../lib/response-handler/SystemResponse";

class Authentication {
  private readonly secretKey = serverConfig.jwtSecret;

  validateRequest = (req: Request, res: Response, next: NextFunction): any => {
    logger.info("Validate Request ");
    try {
      const token: any = req.header("authorization");

      logger.info(`token is: ${token}`);
      if (!token) {
        return res
          .status(403)
          .send(SystemResponse.unAuthenticated("UnAuthorized"));
      }
      const decoded = jwt.verify(token, this.secretKey) as JwtPayload;

      next();
    } catch (error) {
      if (
        error instanceof TokenExpiredError ||
        error instanceof JsonWebTokenError
      ) {
        return res
          .status(403)
          .send(SystemResponse.unAuthenticated("UnAuthorized"));
      }

      return res
        .status(500)
        .send(SystemResponse.getErrorResponse("Internal Server Error"));
    }
  };

  public authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response<any, Record<string, any>> | undefined => {
    logger.info("Authentication - authenticate");
    const token: any = req.header("authorization");

    if (!token) {
      next();
      return;
    }
    try {
      const decoded: string | jwt.JwtPayload = jwt.verify(
        token,
        this.secretKey
      );
      return res.status(200).json({
        message: "Login Successful",
        details: decoded,
        tokenIs: token,
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        next();
        return;
      }
      return res.status(403).json({ message: error });
    }
  };
}

export default new Authentication();
