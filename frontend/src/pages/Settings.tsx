import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { ConnectionForm } from '@/components/ConnectionForm';
import { HistorySlider } from '@/components/HistorySlider';
import { ChatbotSlider } from '@/components/ChatbotSlider';
import { useAuth } from '@/contexts/AuthContext';
import { SnowflakeConfig, LoadResult } from '@/types';

export default function Settings() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<LoadResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (config: SnowflakeConfig) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const result: LoadResult = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      config,
      agentSummary: `Analysis complete for database "${config.dbName}". Your Snowflake instance shows healthy performance metrics with some optimization opportunities. The data warehouse is running efficiently with an average query response time of 2.3 seconds. Total storage utilization is at 67% across 142 tables with 3.2TB of data processed daily.`,
      recommendations: [
        'Consider implementing clustering keys on frequently queried tables to improve scan efficiency',
        'Enable auto-suspend for warehouses with idle time exceeding 10 minutes',
        'Review and optimize TOP_N queries that consume 40% of compute resources',
        'Implement materialized views for complex aggregation queries',
        'Set up query result caching for repetitive analytical workloads',
      ],
      observations: [
        'Peak query activity occurs between 9 AM - 11 AM and 2 PM - 4 PM EST',
        '23 tables have no clustering keys defined despite high query frequency',
        'Warehouse XL-ANALYTICS shows 45% idle time during weekends',
        'Data loading jobs complete 15% faster during off-peak hours',
        'Storage costs have increased 12% month-over-month',
        'User session concurrency peaks at 85 simultaneous connections',
      ],
    };

    setHistory((prev) => [result, ...prev]);
    setIsLoading(false);
    
    // Navigate to dashboard with result
    navigate('/dashboard', { state: { result } });
  };

  const handleSelectHistory = (result: LoadResult) => {
    navigate('/dashboard', { state: { result } });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onHistoryClick={() => setIsHistoryOpen(true)} 
        onAnalysisClick={() => navigate('/dashboard')}
      />

      <main className="container py-6 md:py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          {/* Back button and title */}
          <div className="animate-fade-in flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                <span className="text-primary">Settings</span>
              </h1>
              <p className="text-muted-foreground">Connect your Snowflake instance to analyze your data warehouse</p>
            </div>
          </div>

          {/* Connection Form */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <ConnectionForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 md:h-14 md:w-14 rounded-full shadow-elevated group"
        variant="hero"
        size="icon"
      >
        <div className="relative">
          <MessageSquare className="h-6 w-6 md:h-7 md:w-7 group-hover:scale-0 transition-transform" />
          <Sparkles className="h-6 w-6 md:h-7 md:w-7 absolute inset-0 scale-0 group-hover:scale-100 transition-transform" />
        </div>
      </Button>

      {/* Sliders */}
      <HistorySlider
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectLoad={handleSelectHistory}
      />

      <ChatbotSlider
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}
