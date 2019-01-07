import Config from "./../config/Config";
import Http from "./Http";

const Helper = {
    http: new Http(Config.baseUrl)
}

export default Helper;
