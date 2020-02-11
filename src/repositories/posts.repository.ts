import { queryBuilder } from '../core/db/index';


export default class PostRepository {

    public static async getPublicPosts(search?: string, page?: number): Promise<any> {
        return queryBuilder
            .select('name', 'username', 'gravatar_hash', 'image_url', 'photos.created_at', 'comment_text')
            .from('photos')
            .leftOuterJoin('users', 'users.id', 'photos.user_id', 'comment.user_id')
            .orderBy('photos.created_at', 'desc');
    }

     /**SELECT DE PERFIL (ex: fotos de quem eu sigo, n° de curtidas e comentarios de fotos)*/
     public static async getFolloweesPosts(user: number): Promise<any> {
        const sql = `
        SELECT photos.id, photos.image_url, users.username, photos.created_at,photos.text_photo, likecount, commentcount 
        FROM photos
        LEFT JOIN 
            (SELECT photo_id, COUNT(*) AS likecount FROM likes GROUP BY photo_id) AS liketable ON photos.id = liketable.photo_id
        LEFT JOIN 
            (SELECT photo_id, COUNT(*) AS commentcount FROM comments GROUP BY photo_id) AS commenttable ON photos.id = commenttable.photo_id
        JOIN users ON photos.user_id = users.id
        JOIN (SELECT followee_id FROM follows WHERE follower_id = :user_id) AS userFollowees ON user_id = userFollowees.followee_id
        GROUP BY photos.id ORDER BY photos.created_at DESC;
        `;

         return queryBuilder.raw(sql, { user_id: user });
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
        
        return queryBuilder.raw(sql, { image_url: urlImage, user_id: userId, text_photo: legend});        
        
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
        const sql = ` SELECT photos.id, photos.image_url, users.username, photos.created_at,photos.text_photo, likecount, commentcount  FROM photos
        LEFT JOIN (SELECT photo_id, COUNT(*) AS likecount FROM likes GROUP BY photo_id) AS liketable ON photos.id = liketable.photo_id
        LEFT JOIN (SELECT photo_id, COUNT(*) AS commentcount FROM comments GROUP BY photo_id) AS commenttable ON photos.id = commenttable.photo_id
        JOIN users ON photos.user_id = users.id
        WHERE photos.id = :user_id
        GROUP BY photos.id ORDER BY photos.created_at DESC; 
        `;

         return queryBuilder.raw(sql, { user_id: photoId });      
        
    }

    public static async checkTag(tag_name: string): Promise<any> {
        
            return queryBuilder
            .select()
            .from('tags')
            .where('tag_name', '=', tag_name)
            .then(function(rows) {
                if (rows.length === 0) {
                    // significa que nao achou a tag
                    return queryBuilder
                            .insert({tag_name}).into('tags');
                } else {
                    //faz nada
                }
            })
            .catch(function(error) {
                // you can find errors here.
                console.log(error)
                return error
              })
   
    }



  
   



}