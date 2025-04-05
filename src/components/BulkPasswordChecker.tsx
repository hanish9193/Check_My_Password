
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, RefreshCw } from "lucide-react";
import { analyzePasswordWithAI, AiPasswordAnalysis } from "@/lib/ai-password-service";
import { getStrengthColor, getStrengthLabel } from "@/lib/password-utils";
import { useToast } from "@/hooks/use-toast";

interface PasswordResult extends AiPasswordAnalysis {
  password: string;
}

export function BulkPasswordChecker() {
  const { toast } = useToast();
  const [passwordList, setPasswordList] = useState("");
  const [results, setResults] = useState<PasswordResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyzePasswords = () => {
    if (!passwordList.trim()) {
      toast({
        title: "No passwords",
        description: "Please enter at least one password to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Split the text by new lines
      const passwords = passwordList
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);
      
      if (passwords.length === 0) {
        toast({
          title: "No valid passwords",
          description: "Please enter at least one valid password",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Analyze each password
      const newResults: PasswordResult[] = passwords.map(password => {
        const analysis = analyzePasswordWithAI(password);
        return {
          ...analysis,
          password
        };
      });
      
      setResults(newResults);
      
      toast({
        title: "Analysis complete",
        description: `${newResults.length} passwords analyzed successfully`,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Error",
        description: "Failed to analyze passwords",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Bulk Password Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Textarea 
            placeholder="Enter passwords (one per line)" 
            className="glass-input min-h-[120px]" 
            value={passwordList}
            onChange={(e) => setPasswordList(e.target.value)}
          />
          
          <Button 
            onClick={handleAnalyzePasswords} 
            className="glass-button w-full"
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            Analyze Passwords
          </Button>
        </div>
        
        {results.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-sm text-muted-foreground">
              {results.length} passwords analyzed
            </div>
            
            <ScrollArea className="h-[350px] rounded-md glass border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead>Password</TableHead>
                    <TableHead>Strength</TableHead>
                    <TableHead>Time to Crack</TableHead>
                    <TableHead>Issues</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-mono">{result.password}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getStrengthColor(result.strength)}`} />
                          <span>{getStrengthLabel(result.strength)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{result.timeToCrack}</TableCell>
                      <TableCell>
                        {result.vulnerabilities.length > 0 ? (
                          <ul className="text-xs list-disc ml-4 text-orange-300">
                            {result.vulnerabilities.map((vuln, i) => (
                              <li key={i}>{vuln}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-green-300">No issues found</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
