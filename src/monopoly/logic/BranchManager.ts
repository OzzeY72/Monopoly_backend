import { IBranch, ICoupleAble } from "./interface/BranchInterfaces";
import { OwnAbleBranch } from "./Branches/OwnAbleBranch";
import { DefaultBranch } from "./Branches/DefaultBranch";
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
    getOwnAbleBranches(){
        return this.getBranches().filter(branch=>branch instanceof OwnAbleBranch);
    }
    getBranchesWithStar(){
        return this.getBranches().filter(branch=>branch instanceof DefaultBranch);
    }
    getStarSum(){
        let star_count = 0;
        this.getBranchesWithStar().forEach((branch:DefaultBranch)=>{ 
            star_count += branch.star_count;
        });
        return star_count;
    }
    getBranchesByType(type:string){
        return this.typed_branches.get(type);
    }
    add(branch){
        if(!this.typed_branches.has(branch.type)){
            this.typed_branches.set(branch.type,[branch]);
        }
        else{
            this.typed_branches.get(branch.type).push(branch);
        }
        this.getOwnAbleBranches().forEach((branch)=>this.updateCoupled(branch));
        Event.getInstance().invoke('playerEarn',branch);
    }
    remove(branch:IBranch){
        const branches = this.getBranchesByType(branch.type);
        branches.splice(branches.indexOf(branch),1);

        this.getOwnAbleBranches().forEach((branch)=>this.updateCoupled(branch));
        Event.getInstance().invoke('playerLost',branch);
    }

    private updateCoupled(branch:any)
    {
        if ((branch as ICoupleAble).couple_level !== undefined) {
            branch.setCoupleLevel(this.typed_branches.get(branch.type).length+1);
        } 
    }
}