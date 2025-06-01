import axios from "axios";
import config from "~/config";

class ServerBase {
  static accessToken = null;

  static async getServerPath() {
    return config.apiUrl;
  }


  static async getRequest(endpoint, params = null) {


    try {
      let url = (await this.getServerPath()) + endpoint;

      if (params) {
        const queryString = new URLSearchParams(params).toString();
        url += `?${queryString}`;
      }

      let headers = {};
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: url,
        headers: headers,
      };

      const response = await axios.request(config);
      return response.status === 200 ? response.data : null;
    } catch (error) {
      console.error(`${endpoint}: ${error.message}`);
      return null;
    }
  }

  static async postRequest(endpoint, data) {
    try {
      const url = (await this.getServerPath()) + endpoint;
      console.log("post endpoint: " + url);

      let headers = {
        "Content-Type": "application/json",
      };

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: url,
        headers: headers,
        data: JSON.stringify(data),
      };

      const response = await axios.request(config);
      return response.status === 200 ? response.data : null;
    } catch (error) {
      console.error(`${endpoint}: ${error.message}`);
      return null;
    }
  }

  static async deleteRequest(endpoint, params = null) {


    try {
      let url = (await this.getServerPath()) + endpoint;

      if (params) {
        const queryString = new URLSearchParams(params).toString();
        url += `?${queryString}`;
      }

      let headers = {};

      let config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: url,
        headers: headers,
      };

      const response = await axios.request(config);
      return response.status === 200 ? response.data : null;
    } catch (error) {
      console.error(`${endpoint}: ${error.message}`);
      return null;
    }
  }

}

export default ServerBase;
