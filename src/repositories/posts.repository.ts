import { queryBuilder } from '../core/db/index';


export default class PostRepository {

    public static async getPublicUsers(search?: string, page?: number, rowsLimit?: number): Promise<any> {
        var initialRow = page * rowsLimit;

        search = `%${search}%`;
        const sql = `SELECT users.id as idUser, users.name, users.username, users.email, users.gravatar_hash, users.created_at, seguindoCount, seguidoresCount FROM users 
        LEFT JOIN 
            (SELECT follower_id, COUNT(*) AS seguindoCount FROM follows GROUP BY follower_id) AS seguindoTable ON users.id = seguindoTable.follower_id
        LEFT JOIN 
            (SELECT followee_id, COUNT(*) AS seguidoresCount FROM follows GROUP BY followee_id) AS seguidoresTable ON users.id = seguidoresTable.followee_id
            WHERE users.username LIKE :search OR users.name LIKE :search
            LIMIT :initialRow, :numRows;`;

        return queryBuilder.raw(sql, { search: search, initialRow: initialRow, numRows: rowsLimit });
    }

    public static async postComment(comment: string, photoId: number, userId: number): Promise<any> {
        return queryBuilder.insert({
            comment_text: comment,
            photo_id: photoId,
            user_id: userId
        }).into('comments');

    }

    public static async deleteComment(photoId: string, userId: number): Promise<any> {
        return queryBuilder('comments')
            .where('id', '=', photoId)
            .andWhere('user_id', '=', userId)
            .del()

    }

    public static async like(photoId: string, userId: number): Promise<any> {
        return queryBuilder.insert({
            photo_id: photoId,
            user_id: userId
        }).into('likes');

    }

    public static async disLike(photoId: string, userId: number): Promise<any> {
        return queryBuilder('likes')
            .where('photo_id', '=', photoId)
            .andWhere('user_id', '=', userId)
            .del()

    }

    /**SELECT DE PAGINAS (count de quantas paginas serão necessarias de acordo com os posts de amigos)*/
    public static async getAllFolloweesPages(user: number): Promise<any> {
        const sql = `
        SELECT  COUNT(*) AS total 
        FROM photos
        JOIN users ON photos.user_id = users.id
        JOIN (SELECT followee_id FROM follows WHERE follower_id = :user_id) AS userFollowees ON user_id = userFollowees.followee_id;`
        return queryBuilder.raw(sql, { user_id: user });

    }
    /**SELECT DE PERFIL (ex: fotos de quem eu sigo, n° de curtidas e comentarios de fotos)*/
    public static async getFolloweesPosts(userId: number, page: number, rowsLimit: number): Promise<any> {
        var initialRow = page * rowsLimit;
        const sql = `
        SELECT COUNT(*), photos.id as idPhoto, photos.image_url,users.id as userId, users.username,users.gravatar_hash, photos.created_at,photos.text_photo, likecount, commentcount 
        FROM photos
        LEFT JOIN 
            (SELECT photo_id, COUNT(*) AS likecount FROM likes GROUP BY photo_id) AS liketable ON photos.id = liketable.photo_id
        LEFT JOIN 
            (SELECT photo_id, COUNT(*) AS commentcount FROM comments GROUP BY photo_id) AS commenttable ON photos.id = commenttable.photo_id
        JOIN users ON photos.user_id = users.id
        JOIN (SELECT followee_id FROM follows WHERE follower_id = :user_id) AS userFollowees ON user_id = userFollowees.followee_id
        GROUP BY photos.id ORDER BY photos.created_at DESC
        LIMIT :initialRow, :numRows;
        `;

        return queryBuilder.raw(sql, { user_id: userId, initialRow: initialRow, numRows: rowsLimit });
    }

    public static async getProfileFriend(user: number): Promise<any> {
        const sql = `
        SELECT photos.id, photos.image_url, users.username, photos.created_at,photos.text_photo, likecount, commentcount  FROM photos
        LEFT JOIN 
            (SELECT photo_id, COUNT(*) AS likecount FROM likes GROUP BY photo_id) AS liketable ON photos.id = liketable.photo_id
        LEFT JOIN   
             (SELECT photo_id, COUNT(*) AS commentcount FROM comments GROUP BY photo_id) AS commenttable ON photos.id = commenttable.photo_id
        JOIN users ON photos.user_id = users.id
        WHERE users.id = :user_id
        GROUP BY photos.id ORDER BY photos.created_at DESC;
        
        `;
        return queryBuilder.raw(sql, { user_id: user });
    }

    public static async postImage(urlImage: string, userId: number, legend: string): Promise<any> {
        const sql = `
        INSERT INTO photos(image_url, user_id, text_photo) VALUES (:image_url, :user_id, :text_photo);`

        return queryBuilder.raw(sql, { image_url: urlImage, user_id: userId, text_photo: legend });

    }

    public static async deleteImage(photoId: number, userId: number): Promise<any> {
        return queryBuilder('photos')
            .where('id', '=', photoId)
            .andWhere('user_id', '=', userId)
            .del()

    }


    public static async tagImage(tagName: string, idPhoto: number): Promise<number[]> {
        //tagId terá a query que busca o tagId a parte de um tagName
        var tagId = queryBuilder
            .select('id')
            .from('tags')
            .where('tag_name', '=', tagName);

        const sql2 = `
        INSERT INTO photo_tags(photo_id, tag_id) VALUES (:photo_id, :tag_id);`

        return queryBuilder.raw(sql2, { photo_id: idPhoto, tag_id: tagId });
    }

    public static async photoSelected(photoId: number): Promise<any> {
        const sql = ` SELECT photos.id, users.gravatar_hash, photos.image_url, users.username, photos.created_at,photos.text_photo, likecount, commentcount  FROM photos
        LEFT JOIN (SELECT photo_id, COUNT(*) AS likecount FROM likes GROUP BY photo_id) AS liketable ON photos.id = liketable.photo_id
        LEFT JOIN (SELECT photo_id, COUNT(*) AS commentcount FROM comments GROUP BY photo_id) AS commenttable ON photos.id = commenttable.photo_id
        JOIN users ON photos.user_id = users.id
        WHERE photos.id = :user_id
        GROUP BY photos.id ORDER BY photos.created_at DESC; 
        `;

        return queryBuilder.raw(sql, { user_id: photoId });

    }

    public static async tagsPhotoSelected(tagId: number): Promise<any> {
        const sql = `
        SELECT photos.id as idDaFoto, tags.tag_name 
        FROM photos 
        INNER JOIN photo_tags ON photos.id = photo_tags.photo_id 
        INNER JOIN tags ON photo_tags.tag_id = tags.id 
        WHERE photos.id = :user_id;`;

        return queryBuilder.raw(sql, { user_id: tagId });

    }

    public static async selectCommentsPhoto(idPhoto: number): Promise<any> {
        const sql = `
        SELECT comments.comment_text ,comments.id, comments.created_at, users.username
        FROM photos 
        LEFT JOIN comments ON comments.photo_id = photos.id
        LEFT JOIN users ON comments.user_id = users.id
        where photos.id = :photo_id
        ORDER BY photos.id;`

        return queryBuilder.raw(sql, { photo_id: idPhoto });
    }

    public static async checkTag(tag_name: string): Promise<any> {

        return queryBuilder
            .select()
            .from('tags')
            .where('tag_name', '=', tag_name)
            .then(function (rows) {
                if (rows.length === 0) {
                    // significa que nao achou a tag
                    return queryBuilder
                        .insert({ tag_name }).into('tags');
                } else {
                    //faz nada
                }
            })
            .catch(function (error) {
                // you can find errors here.
                console.log(error)
                return error
            })

    }








}