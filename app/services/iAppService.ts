import {WineTasting} from "../entities/wineTasting";

export interface IAppService {
    getWineTastings(): WineTasting[];
}
