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
     * 新增餐廳
     * @param info 餐廳資訊
     * @returns resp
     */
    public async insertOne(info: restaurant): Promise<resp<DBResp<restaurant>>> {
        const resp: resp<DBResp<restaurant>> = {
            code: 200,
            message: "",
            body: {} as DBResp<restaurant>  // 提供初始值
        }
    
        try {
            const res = new restaurantModel(info);
            const savedRestaurant = await res.save();
            resp.body = savedRestaurant;  // 這裡的型別應該是匹配的
            resp.message = "Restaurant added successfully";
        } catch (error) {
            resp.message = "Server error";
            resp.code = 500;
            console.log(error);
        }
    
        return resp;
    }
    /**
     * 刪除一筆資料
     * @param id 餐廳 ID 
     * @returns resp<any>
     */
    public async deletedById(id: string) {
        const resp: resp<any> = {
            code: 200,
            message: "",
            body: undefined
        }
        const restaurant = await restaurantModel.findById(id);
        if (restaurant) {
            try {
                const res = await restaurantModel.deleteOne({ _id: id });
                resp.message = "Success";
                resp.body = res;
            } catch (error) {
                resp.message = error as string;
                resp.code = 500;
            }
        } else {
            resp.message = "Restaurant not found";
            resp.code = 404;
        }
        return resp;
    }

    /**
     * 更新餐廳名稱
     * @param id 餐廳 ID
     * @param name 新名稱
     * @returns 狀態
     */
    public async updateNameById(id: string, name: string) {
        const resp: resp<DBResp<restaurant> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }
        const restaurant = await restaurantModel.findById(id);
        if (restaurant) {
            try {
                restaurant.name = name;
                await restaurant.save();
                resp.body = restaurant;
                resp.message = "Update success";
            } catch (error) {
                resp.code = 500;
                resp.message = "Server error";
            }
        } else {
            resp.code = 404;
            resp.message = "Restaurant not found";
        }
        return resp;
    }

    /**
    * 根據 ID 查找單一餐廳
    * @param id 餐廳ID
    * @returns 餐廳資訊或未找到的響應
    */
    public async findOneById(id: string): Promise<resp<DBResp<restaurant> | undefined>> {
        const resp: resp<DBResp<restaurant> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }

        try {
            const restaurant = await restaurantModel.findById(id);

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