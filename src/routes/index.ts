import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import path from 'path';
import PostsController from '../controllers/posts.controller';
import UsersController from '../controllers/users.controller';
const router = Router();

// Auth
router.post('/instagamer/login', AuthController.login);
router.post('/instagamer/register', AuthController.signUp);
router.get('/', function (req, res) {
    res.send('login.html')
});
router.get('/instagamer/profile', AuthController.profile);
// router.delete('/api/auth/logout', AuthController.logout);

// posts
router.get('/instagamer/posts', PostsController.getAll);
router.get('/instagamer/posts/photo/:id', PostsController.getPhotoDetails); //photo selected
router.post('/instagamer/posts', PostsController.create);



// Users
// router.get('/instagamer/users', UsersController.profileFriend);
router.get('/instagamer/users/:id', UsersController.profileFriend);
router.get('/instagamer/users/:id/follow', UsersController.newFollow);
router.get('/instagamer/users/:id/unfollow', UsersController.deleteFollow);

export default router;

/**The Router also provides route
 *  methods for all the other HTTP
 *  verbs, that are mostly used in
 *  exactly the same way: post(), put(), delete(), options(), trace(), copy(), lock(),
 *  mkcol(), move(), purge(), propfind(), proppatch(), unlock(), report(), ​​​​​​ mkactivity(), checkout(), merge(),
 *  m-search(), notify(), subscribe(), unsubscribe(), patch(), search(),
 * and connect(). */