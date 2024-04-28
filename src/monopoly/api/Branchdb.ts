export interface RankFee{
    cost:number;
    fee:number;
    pledge:number;
}

export interface Branchdb {
    id: number;
    name: string;
    icon: string;
    description: string;
    star_count: number;
    rankfee: RankFee[];
}