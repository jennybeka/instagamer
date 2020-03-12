<!--
InstaGamer:
App baseado no instagram. Funcionalidades semelhantes.
Utilizado; Nodejs, Typescript, MysQl, Angular
/-->

## Running the server

1) Step one:
    * npm init
    * npm install
    * npm run dev

2) Alternatively you can launch the app from the Terminal:

    * node server.js

3) Sql required - DB 

    **************** MySQL (start) **************
    *name: insta_gamer
    *********************************************

    CREATE DATABASE  IF NOT EXISTS insta_gamer;
    SET NAMES utf8mb4;
    SET FOREIGN_KEY_CHECKS = 0;
    USE insta_gamer; 

    DROP TABLE IF EXISTS `users`;
    CREATE TABLE users (
        `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
        `name` varchar(100) DEFAULT NULL,
        `username` VARCHAR(255) UNIQUE NOT NULL,
        `email` varchar(100) DEFAULT NULL,
        `password` varchar(100) DEFAULT NULL,
        `gravatar_hash` varchar(100) DEFAULT NULL,
        `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `username_UNIQUE` (`username`),
    UNIQUE KEY `email_UNIQUE` (`email`)
    ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

    DROP TABLE IF EXISTS `photos`;
    CREATE TABLE photos (
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
        text_photo varchar(255) DEFAULT NULL,
        image_url VARCHAR(255) NOT NULL,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT const_photo_user
        FOREIGN KEY(user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;


    DROP TABLE IF EXISTS `comments`;
    CREATE TABLE comments (
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
        comment_text VARCHAR(255) NOT NULL,
        photo_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT const_comments_photo FOREIGN KEY(photo_id) REFERENCES photos(id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT const_comments_user FOREIGN KEY(user_id) REFERENCES users(id)  ON DELETE CASCADE ON UPDATE CASCADE
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;


    DROP TABLE IF EXISTS `likes`;
    CREATE TABLE likes (
        user_id INTEGER NOT NULL,
        photo_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY(user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        FOREIGN KEY(photo_id) REFERENCES photos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        PRIMARY KEY(user_id, photo_id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;


    DROP TABLE IF EXISTS `follows`;
    CREATE TABLE follows (
        follower_id INTEGER NOT NULL,
        followee_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY(follower_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        FOREIGN KEY(followee_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        PRIMARY KEY(follower_id, followee_id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;

    DROP TABLE IF EXISTS `tags`;
    CREATE TABLE tags (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;

    DROP TABLE IF EXISTS `photo_tags`;
    CREATE TABLE photo_tags (
        photo_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        FOREIGN KEY(photo_id) REFERENCES photos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        FOREIGN KEY(tag_id) REFERENCES tags(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        PRIMARY KEY(photo_id, tag_id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;





***************************************************