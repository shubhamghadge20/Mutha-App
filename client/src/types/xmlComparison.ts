export interface XmlComparisonItem {
  itemName: string;
  resultValue: number;
  lowertolerance: number;
  uppertolerance: number;
  inTolerance: boolean;
}

export interface XmlComparisonResponse {
  latestFile: string;
  selectedProduct: string;
  sampleName: string;
  comparisonResults: XmlComparisonItem[];
  date: string;
}
export interface XmlComparisonHistoryItem {
  _id: string;
  latestFile: string;
  selectedProduct: string;
  sampleName: string;
  date: string;
  comparisonResults: XmlComparisonItem[];
}

export interface XmlItem {
  itemName: string;
  resultValue: number;
  lowertolerance: number;
  uppertolerance: number;
  inTolerance: boolean;
}

export interface XmlData {
  latestFile: string | null;
  selectedProduct: string;
  sampleName: string;
  comparisonResults: XmlItem[];
  date: string;
}
