import { Branchdb } from "./Branchdb";

export interface IDataBase{
    getBranch: (a:number) => Branchdb;
}