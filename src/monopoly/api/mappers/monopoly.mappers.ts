import { IAction } from "src/monopoly/logic/Action";
import { IBranch, IUpgradeAble } from "../../logic/interface/BranchInterfaces"
import { Branchdb} from "../Branchdb"
import { IDataBase } from "../IDataBase";
import { dtoAction } from "../dto/dtoAction";
import { DefaultBranch } from "src/monopoly/logic/Branches/DefaultBranch";
import { Branch } from "src/monopoly/logic/Branches/Branch";
import { dtoBranch } from "../dto/dtoBranch";
import { OwnAbleBranch } from "src/monopoly/logic/Branches/OwnAbleBranch";
import { Player } from "src/monopoly/logic/Player";
import { dtoPlayer } from "../dto/dtoPlayer";
import { Game } from "src/monopoly/logic/Game";
import { dtoGame } from "../dto/dtoGame";

function AbstractBranchToDTO(branch:Branch):dtoBranch{
    return (new dtoBranch(
        branch.getClass(),
        branch.id,
        branch.name,
        branch.icon,
        branch.description,
        branch.type,
        null,
        false,
        0,
        null,
        0
    ));
}
function OwnAbleBranchToDTO(branch:OwnAbleBranch):dtoBranch{
    return (new dtoBranch(
        branch.getClass(),
        branch.id,
        branch.name,
        branch.icon,
        branch.description,
        branch.type,
        branch.owner,
        branch.inPledge,
        branch.inPledgeDaysLeft,
        branch.getCurrentFee(),
        0
    ));
}
function UpgradableBranchToDTO(branch:any):dtoBranch{
    return (new dtoBranch(
        branch.getClass(),
        branch.id,
        branch.name,
        branch.icon,
        branch.description,
        branch.type,
        branch.owner,
        branch.inPledge,
        branch.inPledgeDaysLeft,
        branch.getCurrentFee(),
        branch.star_count
    ));
}
export function GameToDTO(game: Game){
    return new dtoGame(
        game.getTurn(),
        game.getCurrentCube(),
        actionToDTO(game.getAction()),
        game.getPlayers().map(player=>PlayerToDTO(player)),
        game.getBranches().map(branch=>BranchToDTO(branch)),
        game.getGameState()
    );
}
export function PlayerToDTO(player: Player){
    return new dtoPlayer(
        player.id,
        player.nickname,
        player.money,
        player.location,
        player.canMove,
        player.alive,
        player.getFullCapital(),
        player.branch_manager.getBranches().map(branch=>BranchToDTO(branch))
    );
}

export function BranchToDTO(branch:IBranch){
    switch(branch.getClass()){
        case "Branch": return AbstractBranchToDTO(branch as Branch);
        case "DefaultBranch": return UpgradableBranchToDTO(branch);
        case "OwnAbleBranch": return OwnAbleBranchToDTO(branch as DefaultBranch);
       
    }
}

export function actionToDTO(action:IAction):dtoAction
{
    if(action == null) return null;
    return ({
        name: action.name,
        description: action.description,
        player_id: action.player.id,
        buttons: [
            [action.buttons[0][0],true],
            action.buttons.length > 1 ? [action.buttons[1][0],false] : null
        ]
    })
}