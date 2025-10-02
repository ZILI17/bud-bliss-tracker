
export interface Consumption {
  id: string;
  type: 'herbe' | 'hash' | 'cigarette';
  quantity: string;
  date: string;
  note?: string;
  price?: number;
  cigs_added?: number; // Nombre de cigarettes intégrées au joint (support décimal)
}

export interface ConsumptionStats {
  weekTotal: { [key: string]: number };
  monthTotal: { [key: string]: number };
  dailyAverage: { [key: string]: number };
  recentData: Array<{ 
    date: string; 
    herbe: number; 
    hash: number; 
    cigarette: number;
    herbeWeight: number;
    hashWeight: number;
    herbeCost: number;
    hashCost: number;
    cigaretteCost: number;
  }>;
  weekWeight: { [key: string]: number };
  monthWeight: { [key: string]: number };
  dailyWeightAverage: { [key: string]: number };
  weekCost: { [key: string]: number };
  monthCost: { [key: string]: number };
  totalCost: number;
  dailyCostAverage: { [key: string]: number };
}
