import { useState } from 'react';
import { X, Database, User, Lock, Shield, Globe, Loader2, Snowflake, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SnowflakeConfig } from '@/types';

interface SettingsSliderProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: SnowflakeConfig) => void;
  isLoading: boolean;
}

const regions = [
  { value: 'us-west-2', label: 'US West (Oregon)', flag: '🇺🇸' },
  { value: 'us-east-1', label: 'US East (N. Virginia)', flag: '🇺🇸' },
  { value: 'eu-west-1', label: 'EU (Ireland)', flag: '🇮🇪' },
  { value: 'eu-central-1', label: 'EU (Frankfurt)', flag: '🇩🇪' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)', flag: '🇸🇬' },
  { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)', flag: '🇦🇺' },
];

export function SettingsSlider({ isOpen, onClose, onSubmit, isLoading }: SettingsSliderProps) {
  const [config, setConfig] = useState<SnowflakeConfig>({
    dbName: '',
    username: '',
    password: '',
    role: '',
    region: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
  };

  const isValid = config.dbName && config.username && config.password && config.role && config.region;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 z-50 bg-background/30 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      
      {/* Settings Slider - match HistorySlider width */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-border bg-white dark:bg-background shadow-elevated animate-slide-in-right">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 md:px-5 py-2.5 md:py-3 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-hero shadow-glow">
                <Snowflake className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Snowflake Connection</h2>
                <p className="text-sm text-muted-foreground">Enter your credentials to analyze your data warehouse</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-destructive/10 hover:text-destructive">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Form Content */}
          <ScrollArea className="flex-1 p-3 md:p-4">
            <div className="mx-auto">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dbName" className="flex items-center gap-2 text-sm font-medium">
                      <Database className="h-4 w-4 text-primary" />
                      Database Name
                    </Label>
                    <Input
                      id="dbName"
                      placeholder="my_database"
                      value={config.dbName}
                      onChange={(e) => setConfig({ ...config, dbName: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4 text-primary" />
                      Username
                    </Label>
                    <Input
                      id="username"
                      placeholder="snowflake_user"
                      value={config.username}
                      onChange={(e) => setConfig({ ...config, username: e.target.value })}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                      <Lock className="h-4 w-4 text-accent" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={config.password}
                      onChange={(e) => setConfig({ ...config, password: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="flex items-center gap-2 text-sm font-medium">
                      <Shield className="h-4 w-4 text-accent" />
                      Role
                    </Label>
                    <Input
                      id="role"
                      placeholder="ACCOUNTADMIN"
                      value={config.role}
                      onChange={(e) => setConfig({ ...config, role: e.target.value })}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region" className="flex items-center gap-2 text-sm font-medium">
                    <Globe className="h-4 w-4 text-primary" />
                    Region
                  </Label>
                  <Select value={config.region} onValueChange={(value) => setConfig({ ...config, region: value })}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.value} value={region.value}>
                          <span className="flex items-center gap-2">
                            <span>{region.flag}</span>
                            <span>{region.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </div>
          </ScrollArea>

          {/* Submit Button */}
          <div className="border-t border-border p-4 md:p-6 bg-gradient-to-t from-muted/30 to-transparent">
            <div className="max-w-3xl mx-auto">
              <Button 
                onClick={handleSubmit} 
                className="w-full h-12 text-base" 
                variant="hero" 
                size="lg" 
                disabled={!isValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing your warehouse...
                  </>
                ) : (
                  <>
                    <Server className="mr-2 h-5 w-5" />
                    Get Data
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
