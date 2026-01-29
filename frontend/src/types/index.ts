export interface SnowflakeConfig {
  dbName: string;
  username: string;
  password: string;
  role: string;
  region: string;
}

export interface LoadResult {
  id: string;
  timestamp: Date;
  config: SnowflakeConfig;
  agentSummary: string;
  recommendations: string[];
  observations: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Domain report types for dashboard visualization
export interface DomainMeta {
  load_id: string;
  generated_at: string;
  schema_analyzed: string;
}

export interface DomainSummary {
  tables_count: number;
  kpis_count: number;
  charts_count: number;
  quality_score: number;
}

export interface DomainUnderstandingTable {
  table: string;
  columns: number;
  rows: number;
}

export interface DomainRelationship {
  table1: string;
  table2: string;
  relationship: string;
}

export interface DomainUnderstanding {
  total_tables: number;
  tables: DomainUnderstandingTable[];
  relationships: DomainRelationship[];
}

export interface DomainKpi {
  name: string;
  description: string;
  sql: string;
  value: number;
}

export interface DomainChartDataPoint {
  [key: string]: string | number;
}

export interface DomainChart {
  name: string;
  description: string;
  chart_type: 'line' | 'bar';
  x_axis: string;
  y_axis: string;
  sql: string;
  sample_data: DomainChartDataPoint[];
}

export interface DomainQualityIssue {
  table: string;
  column: string;
  issue: string;
  suggested_fix: string;
}

export interface DomainDataQuality {
  overall_score: number;
  issues: DomainQualityIssue[];
}

export interface DomainTransformation {
  table: string;
  column: string;
  issue: string;
  action: string;
}

export interface DomainInsightsSection {
  summary: string;
  key_points: string[];
}

export interface DomainReportData {
  meta: DomainMeta;
  summary: DomainSummary;
  understanding: DomainUnderstanding;
  kpis: DomainKpi[];
  charts: DomainChart[];
  data_quality: DomainDataQuality;
  transformations: DomainTransformation[];
  insights: DomainInsightsSection;
}

export interface DomainReport {
  status: 'success' | 'error';
  data: DomainReportData;
}
