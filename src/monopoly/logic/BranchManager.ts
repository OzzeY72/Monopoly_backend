import { IBranch } from "./IBranch";
import { Event } from "./Event";

export class BranchManager{
    private typed_branches: Map<string,IBranch[]> = new Map<string,IBranch[]>();
    constructor(){}
    getBranches(){
        const ret_array:IBranch[] = [];
        this.typed_branches.forEach((arr,type) => {
            arr.forEach(branch=>ret_array.push(branch))
        });
        return ret_array;
    }
    getStarSum(){
        let star_count = 0;
        this.getBranches().forEach((branch)=>{
            star_count += branch.star_count;
        });
        return star_count;
    }
    getBranchesByType(type:string){
        return this.typed_branches.get(type);
    }
    add(branch:IBranch){
        if(!this.typed_branches.has(branch.type)){
            this.typed_branches.set(branch.type,[branch]);
        }
        else{
            this.typed_branches.get(branch.type).push(branch);
        }

        this.checkCoupled(branch);
        Event.getInstance().invoke('playerEarn',branch);
    }
    remove(branch:IBranch){
        const branches = this.getBranchesByType(branch.type);
        branches.splice(branches.indexOf(branch),1);

        this.checkCoupled(branch);
        Event.getInstance().invoke('playerLost',branch);
    }

    private checkCoupled(branch:IBranch)
    {
        const type = branch.type;
        const branches_typed = this.getBranchesByType(type);
        if(branches_typed.length == branch.coupling_max){
            if(branches_typed[0].coupled != 1){
                branches_typed.forEach(branch=>branch.coupled = 1);
                Event.getInstance().invoke('changedCoupling',1);
            }
        }
        else{
            if(branches_typed[0].coupled != 0){
                branches_typed.forEach(branch=>branch.coupled = 0);
                Event.getInstance().invoke('changedCoupling',0);
            }
        }
    }
}