import { 
  Brain, 
  Lightbulb, 
  Eye, 
  CheckCircle2, 
  Sparkles,
  TrendingUp,
  AlertCircle,
  Gauge
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadResult } from '@/types';

interface ResultsDisplayProps {
  result: LoadResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Agent Summary */}
      <Card className="shadow-elevated border-border/50 overflow-hidden">
        <CardHeader className="bg-[#073155]/10 dark:bg-primary/10 border-b border-border/50">
          <CardTitle className="flex items-center gap-4 text-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#073155] dark:bg-primary shadow-glow">
              <Brain className="h-6 w-6 text-white dark:text-primary-foreground" />
            </div>
            <div>
              <span className="text-[#073155] dark:text-primary">
                Agent Summary
              </span>
              <p className="text-sm font-normal text-muted-foreground mt-0.5">AI-powered analysis of your data warehouse</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground leading-relaxed text-base">{result.agentSummary}</p>
          
          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Gauge className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-semibold">2.3s</p>
                <p className="text-xs text-muted-foreground">Avg Query</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">67%</p>
                <p className="text-xs text-muted-foreground">Storage</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Sparkles className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-semibold">142</p>
                <p className="text-xs text-muted-foreground">Tables</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm font-semibold">5</p>
                <p className="text-xs text-muted-foreground">Alerts</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recommendations */}
        <Card className="shadow-card border-border/50 overflow-hidden">
          <CardHeader className="bg-[#073155]/10 dark:bg-accent/10 border-b border-border/50">
            <CardTitle className="flex items-center gap-4 text-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#073155] dark:bg-accent shadow-glow">
                <Lightbulb className="h-5 w-5 text-white dark:text-primary-foreground" />
              </div>
              <span className="text-[#073155] dark:text-accent">Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 group">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-sm text-muted-foreground leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Observations */}
        <Card className="shadow-card border-border/50 overflow-hidden">
          <CardHeader className="bg-[#073155]/10 dark:bg-primary/10 border-b border-border/50">
            <CardTitle className="flex items-center gap-4 text-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#073155] dark:bg-primary shadow-glow">
                <Eye className="h-5 w-5 text-white dark:text-primary-foreground" />
              </div>
              <span className="text-[#073155] dark:text-primary">Observations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              {result.observations.map((obs, index) => (
                <li key={index} className="flex items-start gap-3 group">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground leading-relaxed">{obs}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
