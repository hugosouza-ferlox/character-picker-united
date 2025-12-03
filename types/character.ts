export interface CharacterStat {
  value: number;
  icon: 'arrow' | 'lightning' | 'explosion' | 'leaf';
  color: 'gray' | 'yellow' | 'red' | 'green';
}

export interface Character {
  id: string;
  name: string;
  variant?: string;
  type: 'Hero' | 'Dual Mode/Anti-Hero';
  set?: string;
  groups?: string[];
  imageUrl: string;
  stats: CharacterStat[];
}

