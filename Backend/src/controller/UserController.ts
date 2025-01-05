import { Controller } from "../abstract/Controller";
import { Request, Response } from "express";
import { UserService } from "../Service/UserService";
import { resp } from "../utils/resp";
import { DBResp } from "../interfaces/DBResp";
import { restaurant } from "../interfaces/restaurant";
require('dotenv').config()

export class UserController extends Controller {
    protected service: UserService;

    constructor() {
        super();
        this.service = new UserService();
    }

    public async findAll(Request: Request, Response: Response) {
        const res: resp<Array<DBResp<restaurant>> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }

        const dbResp = await this.service.getAllRestaurants();
        if (dbResp) {
            res.body = dbResp;
            res.message = "find success";
            Response.send(res);
        } else {
            res.code = 500;
            res.message = "server error";
            Response.status(500).send(res);
        }
    }

    public async insertOne(Request: Request, Response: Response) {
        const resp = await this.service.insertOne(Request.body)
        Response.status(resp.code).send(resp)
    }

    public async deleteByName(Request: Request, Response: Response) {
        const resp = await this.service.deleteByName(Request.query.name as string);
        Response.status(resp.code).send(resp);
    }

    public async updateName(Request: Request, Response: Response) {
        const resp = await this.service.updateName(
            Request.query.oldName as string,
            Request.query.newName as string
        );
        Response.status(resp.code).send(resp);
    }

    public async findOneByName(Request: Request, Response: Response) {
        const resp = await this.service.findOneByName(Request.query.name as string);
        Response.status(resp.code).send(resp);
    }
}