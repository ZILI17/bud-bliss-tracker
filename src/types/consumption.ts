
export interface Consumption {
  id: string;
  type: 'herbe' | 'hash' | 'cigarette';
  quantity: string;
  date: string;
  note?: string;
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
  }>;
  weekWeight: { [key: string]: number };
  monthWeight: { [key: string]: number };
  dailyWeightAverage: { [key: string]: number };
}
