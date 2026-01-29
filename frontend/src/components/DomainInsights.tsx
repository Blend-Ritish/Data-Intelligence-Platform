import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { DomainReport } from '@/types';
import { Sparkles, Link as LinkIcon, Database, AlertTriangle, Wrench, Gauge, BarChart3 } from 'lucide-react';

interface DomainInsightsProps {
  report: DomainReport;
}

export function DomainInsights({ report }: DomainInsightsProps) {
  if (!report || !report.data) {
    console.log('DomainInsights: No report data available');
    return null;
  }

  const { meta, summary, understanding, kpis, charts, data_quality, transformations, insights } = report.data;
  
  console.log('DomainInsights rendering with:', { meta, summary, understanding, kpis, charts, data_quality, transformations, insights });

  const chartConfig = {
    value: {
      label: 'Value',
      color: 'hsl(var(--primary))',
    },
  };

  const renderChart = (c: typeof charts[number]) => {
    const data = c.sample_data;
    const xKey = c.x_axis;
    const yKey = c.y_axis;

    return (
      <ChartContainer config={chartConfig} className="w-full h-64">
        {c.chart_type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend />
            <Line type="monotone" dataKey={yKey} stroke="var(--color-value)" strokeWidth={2} dot={false} />
          </LineChart>
        ) : (
          <BarChart data={data} barSize={12}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend />
            <Bar 
              dataKey={yKey} 
              fill="var(--color-value)" 
              radius={[6, 6, 0, 0]} 
            />
          </BarChart>
        )}
      </ChartContainer>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top: Domain + Insights summary/key points */}
      <Card className="shadow-elevated border-border/50 overflow-hidden">
        <CardHeader className="bg-[#073155]/10 dark:bg-primary/10 border-b border-border/50">
          <CardTitle className="flex items-center gap-4 text-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#073155] dark:bg-primary shadow-glow">
              <Sparkles className="h-6 w-6 text-white dark:text-primary-foreground" />
            </div>
            <div>
              <span className="text-foreground">
                {meta.schema_analyzed}
              </span>
              <p className="text-sm font-normal text-muted-foreground mt-0.5">Insights Overview</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">{insights.summary}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {insights.key_points.map((kp, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-[#073155] dark:bg-primary" />
                <span className="text-sm text-muted-foreground">{kp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Database className="h-5 w-5 text-[#073155] dark:text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Tables</div>
              <div className="text-lg font-semibold">{summary.tables_count}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Gauge className="h-5 w-5 text-[#073155] dark:text-accent" />
            <div>
              <div className="text-sm text-muted-foreground">Quality Score</div>
              <div className="text-lg font-semibold">{summary.quality_score}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-[#073155] dark:text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Charts</div>
              <div className="text-lg font-semibold">{summary.charts_count}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Badge variant="secondary">KPIs</Badge>
            <div>
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-lg font-semibold">{summary.kpis_count}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Understanding & Relationships */}
      <Card className="shadow-card border-border/50 overflow-hidden">
        <CardHeader className="bg-[#073155]/10 dark:bg-primary/10 border-b border-border/50">
          <CardTitle className="flex items-center gap-3 text-lg">
            <Database className="h-5 w-5 text-[#073155] dark:text-primary" />
            Understanding & Relationships
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div>
            <div className="text-sm text-muted-foreground mb-2">Tables ({understanding.total_tables})</div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {understanding.tables.map((t) => (
                <div key={t.table} className="rounded-lg border border-border p-3">
                  <div className="font-medium text-sm">{t.table}</div>
                  <div className="text-xs text-muted-foreground">Columns: {t.columns} · Rows: {t.rows !== null && t.rows !== undefined ? t.rows.toLocaleString() : 'N/A'}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-2">Relationships</div>
            <div className="space-y-2">
              {understanding.relationships.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="font-mono bg-muted/50 px-2 py-0.5 rounded">{r.table1}</span>
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono bg-muted/50 px-2 py-0.5 rounded">{r.table2}</span>
                  <span className="text-muted-foreground">via</span>
                  <span className="font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">{r.relationship}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Quality & Transformation */}
      <Card className="shadow-card border-border/50 overflow-hidden">
        <CardHeader className="bg-[#073155]/10 dark:bg-primary/10 border-b border-border/50">
          <CardTitle className="flex items-center gap-3 text-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Data Quality ({data_quality.overall_score}) & Transformation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data_quality.issues.map((q, idx) => (
            <div key={idx} className="rounded-lg border border-border p-3">
              <div className="text-sm font-medium">{q.table} · {q.column}</div>
              <div className="text-xs text-muted-foreground">Issue: {q.issue}</div>
              <div className="text-xs mt-1">Fix: <span className="text-muted-foreground">{q.suggested_fix}</span></div>
              {transformations[idx] && transformations[idx].table === q.table && transformations[idx].column === q.column && (
                <div className="text-xs mt-1">Action: <span className="text-muted-foreground">{transformations[idx].action}</span></div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* KPIs */}
      <Card className="shadow-card border-border/50 overflow-hidden">
        <CardHeader className="bg-[#073155]/10 dark:bg-primary/10 border-b border-border/50">
          <CardTitle className="flex items-center gap-3 text-lg">
            <Gauge className="h-5 w-5 text-[#073155] dark:text-primary" />
            KPIs
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((k) => (
            <div key={k.name} className="rounded-lg border border-border p-3">
              <div className="text-sm font-medium">{k.name}</div>
              <div className="text-xs text-muted-foreground">{k.description}</div>
              <div className="text-lg font-semibold mt-1">
                {k.value !== null && k.value !== undefined 
                  ? (typeof k.value === 'number' ? k.value.toLocaleString() : k.value)
                  : 'N/A'}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Charts */}
      <Card className="shadow-card border-border/50 overflow-hidden">
        <CardHeader className="bg-[#073155]/10 dark:bg-primary/10 border-b border-border/50">
          <CardTitle className="flex items-center gap-3 text-lg">
            <BarChart3 className="h-5 w-5 text-[#073155] dark:text-primary" />
            Charts
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid gap-6 lg:grid-cols-2">
          {charts.map((c) => (
            <div key={c.name} className="space-y-2">
              <div className="text-sm font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.description}</div>
              {renderChart(c)}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
