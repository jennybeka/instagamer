import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import path from 'path';
import PostsController from '../controllers/posts.controller';
import UsersController from '../controllers/users.controller';
const router = Router();


router.get('/', function (req, res) {
    res.redirect('login.html')
});
// Auth
router.post('/instagamer/login', AuthController.login);
router.post('/instagamer/register', AuthController.signUp);
router.get('/instagamer/profile/:page?', AuthController.profile);
router.delete('/instagamer/logout', AuthController.logout);

// posts
router.get('/instagamer/posts/all/:page?/:search?', PostsController.getAllUsers);
router.get('/instagamer/home/:page?', PostsController.getAll);//friends 
router.get('/instagamer/posts/photo/:id', PostsController.getPhotoDetails);
router.post('/instagamer/posts/create', PostsController.create);
router.delete('/instagamer/posts/:idPhoto', PostsController.deleteImage);
router.post('/instagamer/posts/postcomment', PostsController.createComment);
router.delete('/instagamer/posts/comment/:idcomment', PostsController.deleteComment);
router.get('/instagamer/posts/like/:idphoto', PostsController.like);
router.delete('/instagamer/posts/dislike/:idLike', PostsController.disLike);


// Users

router.get('/instagamer/home/friend/:page?/:idFriend?', UsersController.profileFriend);
router.get('/instagamer/follow/:id', UsersController.newFollow);
router.get('/instagamer/unfollow/:id', UsersController.deleteFollow);

export default router;

// router.get('/instagamer/users', UsersController.profileFriend);
//router.get('/instagamer/posts/photo/tag/:idfoto', PostsController.getTagsDetails); //photo selected
/**The Router also provides route
 *  methods for all the other HTTP
 *  verbs, that are mostly used in
 *  exactly the same way: post(), put(), delete(), options(), trace(), copy(), lock(),
 *  mkcol(), move(), purge(), propfind(), proppatch(), unlock(), report(), ​​​​​​ mkactivity(), checkout(), merge(),
 *  m-search(), notify(), subscribe(), unsubscribe(), patch(), search(),
 * and connect(). */