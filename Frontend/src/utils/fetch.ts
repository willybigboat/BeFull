/**
 * 共用的請求設定
 */
const commonConfig = {
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:5173/',
      'Content-Type': 'application/json',
    },
    mode: 'cors' as RequestMode,
  };
  
  /**
   * 異步呼叫 GET API，獲取所有餐廳
   * @param api 要呼叫的api
   * @returns json 結果
   */
  export async function asyncGet(api: string): Promise<any> {
      try {
          const res: Response = await fetch(api, {
              ...commonConfig,
              method: 'GET'
          });
          return await res.json();
      } catch (error) {
          console.error('GET request error:', error);
          throw error;
      }
  }
  
  /**
   * 異步呼叫 POST API，新增餐廳
   * @param api API 端點
   * @param body 餐廳資訊
   * @returns json 結果
   */
  export async function asyncPost(api: string, body: {} | FormData) {
      try {
          const res: Response = await fetch(api, {
              ...commonConfig,
              method: 'POST',
              body: JSON.stringify(body),
          });
          return await res.json();
      } catch (error) {
          console.error('POST request error:', error);
          throw error;
      }
  }
  
  /**
   * 異步執行 DELETE 請求，根據名稱刪除餐廳
   * @param api API 端點
   * @returns json 結果
   */
  export async function asyncDelete(api: string): Promise<any> {
      try {
          const res: Response = await fetch(api, {
              ...commonConfig,
              method: 'DELETE',
          });
          return await res.json();
      } catch (error) {
          console.error('DELETE request error:', error);
          throw error;
      }
  }
  
  /**
   * 異步執行 PUT 請求，更新餐廳名稱
   * @param api API 端點 (包含 oldName 和 newName 查詢參數)
   * @returns json 結果
   */
  export async function asyncPut(api: string): Promise<any> {
      try {
          const res: Response = await fetch(api, {
              ...commonConfig,
              method: 'PUT',
          });
          return await res.json();
      } catch (error) {
          console.error('PUT request error:', error);
          throw error;
      }
  }
  
  /**
   * 異步呼叫單一餐廳 API，根據名稱查找
   * @param api API 端點 (包含 name 查詢參數)
   * @returns json 結果
   */
  export async function asyncsearch(api: string): Promise<any> {
      try {
          const res: Response = await fetch(api, {
              ...commonConfig,
              method: 'GET'
          });
          return await res.json();
      } catch (error) {
          console.error('GET ONE request error:', error);
          throw error;
      }
  }
  
  /**
   * 響應介面定義
   */
  export interface ApiResponse<T> {
      code: number;
      message: string;
      body?: T;
  }