/**
 * 異步呼叫api, 只可用響應體為 json 的 api
 * @param api 要呼叫的api
 * @returns json 結果
 */
export async function asyncGet(api: string): Promise<any> {
    try {
        const res: Response = await fetch(api)
        try {
            return await res.json()
        } catch (error) {
            return error
        }
    } catch (error) {
        return error
    }
}

export async function asyncPost(api: string, body: {} | FormData) {
    const res: Response = await fetch(api, {
        method: 'POST',
        credentials: 'include',
        headers: new Headers({
            'Access-Control-Allow-Origin': "http://localhost:5173/",
            'content-Type': "application/json"
        }),
        body: body instanceof FormData ? body : JSON.stringify(body),
        mode: "cors"
    })
    try {
        let data = res.json()
        return data
    } catch (error) {
        console.error(error)
    }
}

export async function asyncPatch(api: string, body: {} | FormData) {
    const res: Response = await fetch(api, {
        method: 'PATCH',
        headers: new Headers({
            'Access-Control-Allow-Origin': "http://localhost:5173/",
        }),
        body: body instanceof FormData ? body : JSON.stringify(body),
        mode: "cors"
    })
    try {
        let data = res.json()
        return data
    } catch (error) {
        console.error(error)
    }

}
/**
 * 異步執行 DELETE 請求
 * @param api 要呼叫的api url
 * @returns json 結果
 */
export async function asyncDelete(api: string): Promise<any> {
    try {
        const res: Response = await fetch(api, {
            method: 'DELETE',
            headers: new Headers({
                'Access-Control-Allow-Origin': "http://localhost:5173/",
            }),
            mode: "cors",
        });
        try {
            return await res.json();
        } catch (error) {
            console.error("JSON 解析錯誤:", error);
            return error;
        }
    } catch (error) {
        console.error("請求錯誤:", error);
        return error;
    }
}
export async function asyncPut(api: string): Promise<any> {
    try {
        const res: Response = await fetch(api, {
            method: 'PUT',
            headers: new Headers({
                'Access-Control-Allow-Origin': "http://localhost:5173/",
            }),
            mode: "cors",
        });
        try {
            return await res.json();
        } catch (error) {
            console.error("JSON 解析錯誤:", error);
            return error;
        }
    } catch (error) {
        console.error("請求錯誤:", error);
        return error;
    }

}
/**
 * 異步呼叫單一 api, 用於獲取單一資源
 * @param api 要呼叫的api
 * @returns json 結果
 */
export async function asyncGetOne(api: string): Promise<any> {
    try {
        const res: Response = await fetch(api)
        try {
            return await res.json()
        } catch (error) {
            return error
        }
    } catch (error) {
        return error
    }
}