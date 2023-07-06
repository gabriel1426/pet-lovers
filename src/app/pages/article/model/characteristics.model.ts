export interface CharacteristicsModel {
  name: string;
  value: number;
}

export interface Action {
  text: string;
  data: Data;
}

export interface Data {
  action: string;
}
