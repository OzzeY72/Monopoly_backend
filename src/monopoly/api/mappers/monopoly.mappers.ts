import { IAction } from "src/monopoly/logic/Action";
import { IBranch } from "../../logic/IBranch"
import { Branchdb} from "../Branchdb"
import { IDataBase } from "../IDataBase";
import { dtoAction } from "../dto/dtoAction";

export function databaseToLogic(data:Branchdb) : IBranch{
    return ({
        id: data.id,
        name: data.name,
        icon: data.icon,
        description: data.description,
        star_count: 0,
        owner: null,
        rankfee: data.rankfee,
        type: '',
        coupled: 0,
        coupling_max: 0,
        inPledge: false,
        inPledgeDaysLeft:0,

        actions:null,
        getAction:null,
        getCurrentFee:null,
        upgrade:null,
        degrade:null,
        pledge:null,
        ransom:null,

    });
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