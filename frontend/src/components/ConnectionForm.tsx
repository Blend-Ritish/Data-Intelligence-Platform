import { useState } from 'react';
import { 
  Database, 
  User, 
  Lock, 
  Shield, 
  Globe, 
  Loader2,
  Snowflake,
  Server,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SnowflakeConfig } from '@/types';

interface ConnectionFormProps {
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

export function ConnectionForm({ onSubmit, isLoading }: ConnectionFormProps) {
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

  return (
    <Card className="shadow-elevated border-border/50 overflow-hidden">
      <CardHeader className="space-y-3 bg-[#073155]/5 dark:bg-primary/5 border-b border-border/50">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#073155] dark:bg-primary shadow-glow">
            <Snowflake className="h-6 w-6 text-white dark:text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">Snowflake Connection</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to analyze your data warehouse
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dbName" className="flex items-center gap-2 text-sm font-medium">
                <Database className="h-4 w-4 text-[#073155] dark:text-primary" />
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
                <User className="h-4 w-4 text-[#073155] dark:text-primary" />
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
                <Lock className="h-4 w-4 text-[#073155] dark:text-accent" />
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
                <Shield className="h-4 w-4 text-[#073155] dark:text-accent" />
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
              <Globe className="h-4 w-4 text-[#073155] dark:text-primary" />
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

          <Button type="submit" className="w-full h-12 text-base" variant="hero" size="lg" disabled={!isValid || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-white dark:text-primary-foreground" />
                Analyzing your warehouse...
              </>
            ) : (
              <>
                <Server className="mr-2 h-5 w-5 text-white dark:text-primary-foreground" />
                Connect & Analyze
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
