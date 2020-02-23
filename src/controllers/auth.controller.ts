import { Request, Response } from 'express';
import AuthRepository from '../repositories/auth.repository';
import UsersRepository from '../repositories/users.repository';
import { sign } from 'jsonwebtoken';
import { queryBuilder } from '../core/db';
import { userInfo } from 'os';
import PostRepository from '../repositories/posts.repository';

class AuthController {

    public async login(req: Request, res: Response): Promise<Response> {
        try {
            console.log(`No backend testeeeee`)

            const { email, password } = req.body;
            const token = await AuthRepository.attemptLogin(email, password);

            return res.json({ token });
        } catch (err) {
            return res.status(401).json({
                message: err.message
            })
        }
    }

    public async signUp(req: Request, res: Response): Promise<Response> {
        try {
            const { email, username, name, password } = req.body;

            const [userId] = await AuthRepository.register(username, password, name, email);

            if (userId > 0) {
                const token = await AuthRepository.attemptLogin(email, password);
                return res.json({ token });
            }
            return res.status(400).json();
        } catch (err) {
            return res.status(400).json({
                message: err.message
            })
        }
    }

    public async profile(req: Request, res: Response): Promise<Response> {
        const decodedToken = res.locals.decodedToken;
        const { page } = req.params;
        console.log("Antes de PAGE")
        console.log(page)
        console.log("Depois de PAGE")

        const userId = decodedToken.user_id;
        console.log("Antes de userid")
        console.log(userId)
        console.log("Depois de userid")
        const rowsLimit = 5;

        const totalPosts = await UsersRepository.getAllMyPostsPages(Number(userId));

        const user = await UsersRepository.byId(userId);
        const info = await UsersRepository.getPostsById(Number(userId), Number(page), rowsLimit);

        var pageQt = Math.ceil(totalPosts[0][0]['total'] / rowsLimit);

        return res.json({ user: user[0], info: info[0],  pageQt: pageQt });
     

    }
    
    public async logout(req: Request, res: Response): Promise<Response> {
    //    AuthRepository.attemptLogin.destroy(userInfo)
        return 
    }

}
export default new AuthController();