export enum ItemType {
  Project = "Project",
  Report = "Report",
  Training = "Training",
  Evaluation = "Evaluation",
  Framework = "Framework",
  Degree = "Degree",
  Certification = "Certification",
  CaseStudy = "Case Study",
  Brief = "Brief"
}

export interface PortfolioItem {
  section: string;
  title: string;
  content: string;
  artifact: string;
  link: string;
  tags: string[];
  date: string;
  itemType: string;
  status: 'Draft' | 'Ready' | 'Featured';
  order: number;
  subsection?: string;
}

export type GroupedPortfolio = Record<string, PortfolioItem[]>;