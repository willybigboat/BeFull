import { Contorller } from "../abstract/Contorller";
import { Request, response, Response } from "express";
import { UserService } from "../Service/UserService";
import { resp } from "../utils/resp";
import { DBResp } from "../interfaces/DBResp";
import { restaurant } from "../interfaces/restaurant";
require('dotenv').config()

export class UserController extends Contorller {
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
            res.message = "find sucess";
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
    public async deletedById(Request: Request, Response:Response){
        const resp = await this.service.deletedById(Request.query.id as string);
        Response.status(resp.code).send(resp);
    }
    public async updateNameById(Request: Request, Response:Response){
        const resp = await this.service.updateNameById(Request.query.id as string,Request.query.name as string);
        Response.status(resp.code).send(resp);
    }
    public async findOneById(Request: Request, Response:Response){
        const resp = await this.service.findOneById(Request.query.id as string);
        Response.status(resp.code).send(resp);
    }
}