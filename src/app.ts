// /**
// * Module dependencies.
// */
import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import { join } from "path";
import mysql from "mysql";
import router from "./routes";
import TokenMiddleware from './core/auth/token.middleware';

export class App {

    public static run(port: number): void {
        const app = new App().express;
        app.listen(port, () => console.log(`Started at http://localhost:${port}`));
    }

    public express: express.Application;

    public constructor() {
        this.express = express();

        this.setupExpress();
        this.routes();

    }

    private routes(): void {
        this.express.use(express.static(__dirname + "/public"));
        this.express.use(TokenMiddleware.tokenVerify);
        this.express.use(router);
    }

    private setupExpress(): void {
        this.express.use(cors());
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
    }

}
