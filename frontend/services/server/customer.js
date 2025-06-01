import ServerBase from "./serverBase";

class Customer extends ServerBase {
    static async submitContactMessage(formData) {
        const endpoint = "/client/contactUs";
        const params = formData;
        return await this.postRequest(endpoint, params);
      }
}
export default Customer;
