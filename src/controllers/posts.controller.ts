import { Request, Response } from 'express';
import PostsRepository from '../repositories/posts.repository';
import PostRepository from '../repositories/posts.repository';
import { cat } from 'shelljs';


class PostsController {

    public async getAll(req: Request, res: Response): Promise<Response> {

        const rowsLimit = 6;
        const decodedToken = res.locals.decodedToken;
        const userId = decodedToken.user_id;
        const { page } = req.params;

        const totalPosts = await PostsRepository.getAllFolloweesPages(Number(userId));
        const pageQt = Math.ceil(totalPosts[0][0]['total'] / rowsLimit);
        const posts = await PostsRepository.getFolloweesPosts(Number(userId),Number(page), rowsLimit);

        return res.json({ posts: posts[0], pageQt: pageQt, totalPosts: totalPosts[0][0]['total'] });

    }

    public async getAllUsers(req: Request, res: Response): Promise<Response> {
        const rowsLimit = 12;
        const { user_id } = res.locals.decodedToken;
        var { page , search} = req.params;
        
        if (search==undefined || search==null) {
            search="";
        }

        var totalPosts = await PostsRepository.getAllFolloweesPages(user_id);

        var pageQt = Math.ceil(totalPosts[0][0]['total'] / rowsLimit);

        const posts = await PostsRepository.getPublicUsers(search , Number(page), rowsLimit);


        return res.json({ posts: posts[0], pageQt: pageQt });

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
                return res.json({ error });
            }

            //idPhoto receberá o ID da foto que foi criada anteriormente
            var idPhoto = postId[0]['insertId'];

            for (let tag of tags) {
                if (tag !== "") {
                    //função que cria tag caso não exista
                    await PostsRepository.checkTag(tag);
                    //depois de garantir que a tag está no banco, criar o link entre a tagID e a tagPhoto
                    await PostsRepository.tagImage(tag, idPhoto);
                }
            }
            return res.json({ postId: postId[0], success: true, message: 'New post realized!' });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            })
        }
    }

    public async deleteImage(req: Request, res: Response): Promise<Response> {

        try {
            const { idPhoto } = req.params;
            const { user_id } = res.locals.decodedToken;
            const photo = await PostRepository.deleteImage(Number(idPhoto), user_id);

            if (photo == 0) {
                const error = "This photo does not exist"
                return res.json({ error });
            } else {
                return res.json({ photo: photo, message: 'Image Deleted' })
            }
        } catch (error) {
            return res.status(400).json({
                message: error.message,
                text: "Bad delete!"
            })
        }

    }

    public async getPhotoDetails(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const tags = await PostRepository.tagsPhotoSelected(Number(id));
        const photo = await PostRepository.photoSelected(Number(id));
        const comments = await PostRepository.selectCommentsPhoto(Number(id));

        // Se o campo created_at do primeiro registro estiver nulo, significa que o retorno está em branco.
        // Então forçamos que o retorno seja vazio, ao invés de ser uma linha com registros nulos
        if (comments[0][0]["created_at"] === null) {
            comments[0] = [];
        }

        return res.json({ photo: photo[0], tags: tags[0], comments: comments[0] });
    }


    public async createComment(req: Request, res: Response): Promise<Response> {
        try {
            const { comment_text, photoId } = req.body;
            const { user_id } = res.locals.decodedToken;

            const comment = await PostRepository.postComment(comment_text, Number(photoId), user_id);
            return res.json({ comment, success: true, message: 'New comment!' });

        } catch (err) {
            return res.status(401).json({
                message: err.message
            })
        }

    }

    public async deleteComment(req: Request, res: Response): Promise<Response> {
        try {
            const { idcomment } = req.params;
            const { user_id } = res.locals.decodedToken;
            const comment = await PostRepository.deleteComment(idcomment, user_id);
            return res.json({ comment, success: true, message: 'Comment deleted!' });

        } catch (err) {
            return res.status(401).json({
                message: err.message
            })
        }
    }

    public async like(req: Request, res: Response): Promise<Response> {
        try {
            const { idphoto } = req.params;
            const { user_id } = res.locals.decodedToken;

            const like = await PostRepository.like(idphoto, user_id);

            return res.json({ like, success: true, message: 'YEah, Like!' });

        } catch (err) {
            return res.status(401).json({
                message: err.message
            });
        }
    }

    public async disLike(req: Request, res: Response): Promise<Response> {
        try {
            const { idLike } = req.params;
            const { user_id } = res.locals.decodedToken;
            const disLike = await PostRepository.disLike(idLike, user_id);

            return res.json({ disLike, success: true, message: 'DisLike!' });

        } catch (err) {
            return res.status(401).json({
                message: err.message
            })
        }
    }



}

export default new PostsController();