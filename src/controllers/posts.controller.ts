import { Request, Response } from 'express';
import PostsRepository from '../repositories/posts.repository';
import PostRepository from '../repositories/posts.repository';


class PostsController {

    public async getAll(req: Request, res: Response): Promise<Response> {
        const { user_id } = res.locals.decodedToken;
        const posts = await PostsRepository.getFolloweesPosts(user_id);
        return res.json({ posts: posts[0] }); 
    }
    
    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const { image_url, text_photo, tags_image } = req.body;
            
            const { user_id } = res.locals.decodedToken;
            var tags = tags_image.split(",");
            
            //Criar a nova foto
            const postId = await PostsRepository.postImage(image_url, user_id, text_photo);
            
            //Validação do retorno da foto
            if (postId === null) {
                const error = "error!!"
                return res.json( {error});
            }
            
            //idPhoto receberá o ID da foto que foi criada anteriormente
            var idPhoto = postId[0]['insertId'];

                for (let tag of tags)  {
                    if(tag !== ""){

                        //função que cria tag caso não exista
                        await PostsRepository.checkTag(tag);
    
                        //depois de garantir que a tag está no banco, criar o link entre a tagID e a tagPhoto
                        await PostsRepository.tagImage(tag, idPhoto);
                    }
                    
                }
            return res.json({ postId: postId[0], success: true, message: 'New post realized!'});
        } catch (error) {
            return res.status(400).json({
                message: error.message
            })
        }      
    }

    public async getPhotoDetails(req: Request, res: Response): Promise<Response> {
            const { id } = req.params;
            // const tagsPhoto = await PostRepository.tagImage(tagName, idPhoto);
            const photo = await PostRepository.photoSelected(Number(id));
 
            return res.json({  photo: photo[0] });
             
    
    }

}

export default new PostsController();