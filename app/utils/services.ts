import {IAppService} from "../services/iAppService";
import {LocalJsonAppService} from "../services/localJsonAppService";

export class Services {
    public static get current(): IAppService {
        return new LocalJsonAppService();
    }
}
