import { Request, Response } from 'express';
import UsersRepository from '../repositories/users.repository';


class UsersController {

    public async profileFriend(req: Request, res: Response): Promise<Response> {
        const { idFriend, page } = req.params;
        const rowsLimit = 6;

        const totalPosts = await UsersRepository.getAllMyPostsPages(Number(idFriend));

        const user = await UsersRepository.byId(Number(idFriend));
        const info = await UsersRepository.getPostsById(Number(idFriend), Number(page), rowsLimit);
        var pageQt = Math.ceil(totalPosts[0][0]['total'] / rowsLimit);
    
        return res.json({ user: user[0], info: info[0], pageQt: pageQt, totalPosts: totalPosts[0][0]['total'] });

    }

    public async newFollow(req: Request, res: Response): Promise<Response> {

        try {
            const { friendId } = req.params;
            const { user_id } = res.locals.decodedToken;
            const followId = await UsersRepository.follow(user_id, Number(friendId));
      
            if (followId === null) {
                const error = "error!!"
                return res.json({ error });
            }
            return res.json({ followId, success: true, message: 'New followee!' });

        } catch (error) {
            return res.status(400).json({
                message: error.message,
                text: "Bad following!"
            });
        }

    }

    public async deleteFollow(req: Request, res: Response): Promise<Response> {
        try {
            const { friendId } = req.params;
            const { user_id } = res.locals.decodedToken;
            const unfollowId = await UsersRepository.unfollow(user_id, Number(friendId));

            if (unfollowId == 0) {
                const error = "You were not his follower!!"
                return res.json({ error });
            } else {
                return res.json({ unfollowId, success: true, message: 'Unfollow realized!' });
            }

        } catch (error) {
            return res.status(400).json({
                message: error.message,
                text: "Bad unfollow!"
            });
        }

    }

    public async checkingFollower(req: Request, res: Response): Promise<Response> {

        try {
            
            const { user_id } = res.locals.decodedToken;
            const {friendId} = req.params;
            const statusFollower = await UsersRepository.checkFollowing(user_id, Number(friendId))

            if(statusFollower.length == 0){
                return res.json({success:false, message: 'no following'})
            } 
            return res.json({success:true, message: 'following!'})
    
        } catch (error) {
            return res.status(401).json({
                message: error.message
            })

        }


    }



}
export default new UsersController();