import ServerBase from "./serverBase";

class Product extends ServerBase {
  static async getAllProducts() {
    const endpoint = "/client/getAllProducts";
    const response = await this.getRequest(endpoint);
    return response;

    // response = [
    //   {
    //     prodCode: "string",
    //     category: "string",
    //     name: "string",
    //     document: "base64 string",
    //     info: "json string",
    //     "photos": "['base64 string', 'base64 string']",
    //     quantity: int,
    //   },
    // ]
  }

  static async getCategoryNames() {
    const endpoint = "/client/getCategoryNames";
    const response = await this.getRequest(endpoint);

    return response;
    // response = ["cat1", "cat2"]
  }

  static async getCategoryByName(category) {
    const endpoint = "/client/getCategoryByName";
    const params = { name: category };

    const response = await this.getRequest(endpoint, params);
    return response;

    // response = {
    //     "id": 1,
    //     "name": "TOMATOES",
    //     "photo": "base64 string"
    // }
  }

  static async getProductsByCategory(category) {
    const endpoint = "/client/getProductsByCategory";
    const params = { category: category };
    const response = await this.getRequest(endpoint, params);
    return response;

    // response = [
    //   {
    //     prodCode: "string",
    //     category: "string",
    //     name: "string",
    //     document: "base64 string",
    //     info: "{\"description\":\"product description\"}",
    //     "photos": "['base64 string', 'base64 string']",
    //     quantity: int,
    //   },
    // ]
  }

  static async getProdCodesByCategory(category) {
    const endpoint = "/client/getCategoryProdCodes";
    const params = { category: category };
    return await this.getRequest(endpoint, params);
  }

  static async getProductByProdCode(prodCode) {
    const endpoint = "/client/getProductByProdCode";
    const params = { prodCode: prodCode };
    const response = await this.getRequest(endpoint, params);
    return response;

    // response = {
    //     prodCode: "string",
    //     category: "string",
    //     name: "string",
    //     document: "base64 string",
    //     info: "{\"description\":\"product description\"}",
    //     "photos": "['base64 string', 'base64 string']",
    //     quantity: int,
    //   }

  }

  static async getSoldProducts(){
    const endpoint = "/admin/getSoldProducts";
    const response = await this.getRequest(endpoint);
    return response;

    // response = [
  //       {
  //         "id": 1,
  //         "dateSold": "2025-03-09T14:21:42.884852",
  //         "prodCode": "PURMEL",
  //         "category": "MELON",
  //         "name": "Purple Melon",
  //         "photos": "["base64 string","base64 string"]",
  //         "price": 20.0,
  //         "document": "{\"name\":\"\",\"content\":null}",
  //         "info": "{\"description\":\"product description\"}",
  //         "quantity": 1,
  //         "customerName": "Justin Smith",
  //         "customerEmail": "justinpmsmith10@gmail.com",
  //         "customerAddress": "11 klapper street"
  //     }, 
  // ]
  }

  static async getSoldProductById(id){
    const params = { id: id };
    const endpoint = "/admin/getSoldProductById";
    const response = await this.getRequest(endpoint, params);
    return response;

    // response = 
  //       {
  //         "id": 1,
  //         "dateSold": "2025-03-09T14:21:42.884852",
  //         "prodCode": "PURMEL",
  //         "category": "MELON",
  //         "name": "Purple Melon",
  //         "photos": "base64 string",
  //         "price": 20.0,
  //         "document": "{\"name\":\"\",\"content\":null}",
  //         "info": "{\"description\":\"grape flavoured melon\"}",
  //         "quantity": 1,
  //         "customerName": "Justin Smith",
  //         "customerEmail": "justinpmsmith10@gmail.com",
  //         "customerAddress": "11 klapper street"
  //     }
  }






}
export default Product;
