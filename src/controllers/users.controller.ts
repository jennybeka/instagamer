import { Request, Response } from 'express';
import UsersRepository from '../repositories/users.repository';
import AuthRepository from '../repositories/auth.repository';

class UsersController {

    public async profileFriend(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
    
        const user = await UsersRepository.byId(Number(id));
        const info = await UsersRepository.getPostsById(Number(id));

        return res.json({ user: user[0], info: info[0] });
         
    }

    public async newFollow(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { user_id } = res.locals.decodedToken;
            const [followId] = await UsersRepository.follow(user_id, Number(id));
        
        if (followId === null) {
            const error = "error!!"
            return res.json( {error});
        }
        return res.json({ followId, success: true, message: 'New followee!'});

        } catch (error) {
            return res.status(400).json({
                message: error.message,
                text: "Bad following!"
            });
        }
    
    }

    public async deleteFollow(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            console.log(id)
            const { user_id } = res.locals.decodedToken;
            console.log(user_id)
            const unfollowId = await UsersRepository.unfollow(user_id, Number(id));
        
        if (unfollowId == 0) {
            const error = "You were not his follower!!"
            return res.json( {error});
        } else {
            return res.json({ unfollowId, success: true, message: 'Unfollow realized!'});
        }

        } catch (error) {
            return res.status(400).json({
                message: error.message,
                text: "Bad unfollow!"
            });
        }
    
    }

   

}
export default new UsersController();