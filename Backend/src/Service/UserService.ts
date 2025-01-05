import { Service } from "../abstract/Service";
import { restaurant } from "../interfaces/restaurant";
import { logger } from "../middlewares/log";
import { restaurantModel } from "../orm/schemas/restaurantSchemas";
import { Document } from "mongoose"
import { MongoDB } from "../utils/MongoDB";
import { DBResp } from "../interfaces/DBResp";
import { resp } from "../utils/resp";

export class UserService extends Service {

    public async getAllRestaurants(): Promise<Array<DBResp<restaurant>> | undefined> {
        try {
            const res: Array<DBResp<restaurant>> = await restaurantModel.find({});
            return res;
        } catch (error) {
            return undefined;
        }
    }

    /**
     * 新增餐廳，檢查名稱是否已存在
     * @param info 餐廳資訊
     * @returns resp
     */
    public async insertOne(info: restaurant): Promise<resp<DBResp<restaurant>>> {
        const resp: resp<DBResp<restaurant>> = {
            code: 200,
            message: "",
            body: {} as DBResp<restaurant>
        }
    
        try {
            const existingRestaurant = await restaurantModel.findOne({ name: info.name });
            if (existingRestaurant) {
                resp.code = 400;
                resp.message = "Restaurant with this name already exists";
                return resp;
            }

            const res = new restaurantModel(info);
            const savedRestaurant = await res.save();
            resp.body = savedRestaurant;
            resp.message = "Restaurant added successfully";
        } catch (error) {
            resp.message = "Server error";
            resp.code = 500;
            console.log(error);
        }
    
        return resp;
    }

    /**
     * 根據餐廳名稱刪除資料
     * @param name 餐廳名稱
     * @returns resp<any>
     */
    public async deleteByName(name: string) {
        const resp: resp<any> = {
            code: 200,
            message: "",
            body: undefined
        }
        try {
            const restaurant = await restaurantModel.findOne({ name: name });
            if (restaurant) {
                const res = await restaurantModel.deleteOne({ name: name });
                resp.message = "Success";
                resp.body = res;
            } else {
                resp.message = "Restaurant not found";
                resp.code = 404;
            }
        } catch (error) {
            resp.message = error as string;
            resp.code = 500;
        }
        return resp;
    }

    /**
     * 更新餐廳名稱
     * @param oldName 舊餐廳名稱
     * @param newName 新餐廳名稱
     * @returns 狀態
     */
    public async updateName(oldName: string, newName: string) {
        const resp: resp<DBResp<restaurant> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }
        try {
            if (oldName === newName) {
                resp.code = 400;
                resp.message = "New name is same as old name";
                return resp;
            }

            const existingRestaurant = await restaurantModel.findOne({ name: newName });
            if (existingRestaurant) {
                resp.code = 400;
                resp.message = "Restaurant with this name already exists";
                return resp;
            }

            const restaurant = await restaurantModel.findOne({ name: oldName });
            if (restaurant) {
                restaurant.name = newName;
                await restaurant.save();
                resp.body = restaurant;
                resp.message = "Update success";
            } else {
                resp.code = 404;
                resp.message = "Restaurant not found";
            }
        } catch (error) {
            resp.code = 500;
            resp.message = "Server error";
        }
        return resp;
    }

    /**
    * 根據餐廳名稱查找餐廳
    * @param name 餐廳名稱
    * @returns 餐廳資訊或未找到的響應
    */
    public async findOneByName(name: string): Promise<resp<DBResp<restaurant> | undefined>> {
        const resp: resp<DBResp<restaurant> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }

        try {
            const restaurant = await restaurantModel.findOne({ name: name });

            if (restaurant) {
                resp.body = restaurant;
                resp.message = "Restaurant found";
            } else {
                resp.code = 404;
                resp.message = "Restaurant not found";
            }
        } catch (error) {
            resp.code = 500;
            resp.message = "Server error";
            console.error(error);
        }

        return resp;
    }
}