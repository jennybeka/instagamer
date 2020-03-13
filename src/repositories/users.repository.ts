import { queryBuilder } from '../core/db/index';

export default class UsersRepository {

    /**SELECIONA os dados de um usuario pelo seu ID*/
    public static async byId(userId: number): Promise<any> {
        const sql = `
        SELECT users.name, users.id, users.username, users.email, users.gravatar_hash, users.created_at, seguindoCount, seguidoresCount FROM users 
        LEFT JOIN 
            (SELECT follower_id, COUNT(*) AS seguindoCount FROM follows GROUP BY follower_id) AS seguindoTable ON users.id = seguindoTable.follower_id
        LEFT JOIN 
            (SELECT followee_id, COUNT(*) AS seguidoresCount FROM follows GROUP BY followee_id) AS seguidoresTable ON users.id = seguidoresTable.followee_id
        WHERE users.id = :user_id;
        `;
        return queryBuilder.raw(sql, { user_id: userId });
    }

    // /**Count de quantas paginas serão necessarias de acordo com meus posts para serem exibidos na tela*/
    public static async getAllMyPostsPages(user: number): Promise<any> {
        const sql = `
        SELECT COUNT(*) AS total 
        FROM photos
        JOIN users ON photos.user_id = users.id
        WHERE users.id = :user_id`
        return queryBuilder.raw(sql, { user_id: user });

    }

    /**SELECT DE PERFIL (ex: meu perfil e minhas postagens)*/
    public static async getPostsById(user: number, page?: number, rowsLimit?: number): Promise<any> {
        var initialRow = page * rowsLimit;
        const sql = `
        SELECT photos.id as idPhoto, photos.image_url, users.username, photos.created_at,photos.text_photo, likecount, commentcount  FROM photos
        LEFT JOIN (SELECT photo_id, COUNT(*) AS likecount FROM likes GROUP BY photo_id) AS liketable ON photos.id = liketable.photo_id
        LEFT JOIN (SELECT photo_id, COUNT(*) AS commentcount FROM comments GROUP BY photo_id) AS commenttable ON photos.id = commenttable.photo_id
        JOIN users ON photos.user_id = users.id
        WHERE users.id = :user_id
        GROUP BY photos.id ORDER BY photos.created_at DESC
        LIMIT :initialRow, :numRows;
        `;

        return queryBuilder.raw(sql, { user_id: user, initialRow: initialRow, numRows: rowsLimit });
    }

     /**Checar se o usuario ja segue aquele profile*/
    public static async checkFollowing(userId: number, friendId: number): Promise<any> {
        return queryBuilder
            .select('follower_id', 'followee_id')
            .from('follows')
            .where('follower_id', '=', userId)
            .andWhere('followee_id', '=',friendId);
    }

    /**Seguir uma nova pessoa*/
    public static async follow(userId: number, friendId: number): Promise<number[]> {
        return queryBuilder.insert({
            follower_id: userId,
            followee_id: friendId,

        }).into('follows');
    }

     /**Deixar de seguir uma pessoa*/
    public static async unfollow(userId: number, friendId: number): Promise<number> {
        return queryBuilder('follows')
            .where('follower_id', '=', userId)
            .andWhere('followee_id', '=', friendId)
            .del();

    }
}