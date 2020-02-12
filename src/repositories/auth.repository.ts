import { queryBuilder } from '../core/db/index';
import { createHash } from 'crypto';
import { sign } from 'jsonwebtoken';
import { resolveSrv } from 'dns';

/**Responsáveis pelas Querys no banco de dados */
export default class AuthRepository {
    //Verificando se existe permissão para este user
    //jwt.sign(payload, secretOrPrivateKey, [options, callback])
    public static async attemptLogin(email: string, password: string): Promise<string> {
        const user: any = await queryBuilder
            .select()
            .from('users')
            .where('email', '=', email)
            .andWhere('password', '=', createHash('sha256').update(password).digest('hex'))
            .first();

        return new Promise((resolve, reject) => {
            if (user) {
                const token = sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 31),
                    username: user.username,
                    email: user.email,
                    user_id: user.id
                }, 'MyVerySecretKeyForThisToken');

                resolve(token);
            }

            reject(new Error('Bad credentials!'));
        });
    }

    public static async register(username: string, password: string, name: string, email: string): Promise<number[]> {
        password = createHash('sha256').update(password).digest('hex');
        const gravatar = createHash('md5').update(email).digest('hex');

        return queryBuilder.insert({
            username,
            email,
            password,
            name,
            gravatar_hash: gravatar
        }).into('users');
    }

    

    


}