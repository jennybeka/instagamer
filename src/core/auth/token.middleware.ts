import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

/**permissividade de rotas e validação de token */
export default class TokenMiddleware {

    public static async tokenVerify(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const allowedPaths = [
            '/',
            '/instagamer/login',
            '/instagamer/register',
        ];

        if (allowedPaths.includes(req.path)) {
            return next();
        }

        if (!req.headers.authorization) {
            return res.status(403).json({
                code: 403,
                message: 'You cannot access this page without login!'
            });
        }

        try {
            const token = req.headers.authorization.split('Bearer ')[1];
            res.locals.decodedToken = verify(token, 'MyVerySecretKeyForThisToken');
            return next();
        } catch (err) {
            return res.status(403).json({
                code: 403,
                message: 'Invalid token,try again!'
            });
        }
    }
}