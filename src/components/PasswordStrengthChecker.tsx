
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordStrength, getStrengthColor, getStrengthLabel } from "@/lib/password-utils";
import { analyzePasswordWithAI, AiPasswordAnalysis } from "@/lib/ai-password-service";
import { Shield, AlertTriangle, Clock, Lightbulb, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [analysis, setAnalysis] = useState<AiPasswordAnalysis | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (password) {
      const aiAnalysis = analyzePasswordWithAI(password);
      setAnalysis(aiAnalysis);
    } else {
      setAnalysis(null);
    }
  }, [password]);

  const handleCopySuggestion = () => {
    if (analysis?.suggestion) {
      navigator.clipboard.writeText(analysis.suggestion);
      toast({
        title: "Copied",
        description: "Suggested password copied to clipboard",
      });
    }
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AI Password Strength Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter a password to check"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
          autoComplete="off"
          className="glass-input"
        />
        
        {password && analysis && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Password strength:</span>
                <span className="font-medium">
                  {getStrengthLabel(analysis.strength)}
                </span>
              </div>
              <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getStrengthColor(analysis.strength)}`}
                  style={{ width: `${(analysis.strength + 1) * 20}%` }}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-md p-3 glass">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Estimated time to crack:</p>
                  <p className="text-sm text-muted-foreground">{analysis.timeToCrack}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Password entropy:</p>
                  <p className="text-sm text-muted-foreground">{analysis.entropyBits} bits</p>
                </div>
              </div>
            </div>
            
            {analysis.vulnerabilities.length > 0 && (
              <div className="rounded-md p-3 glass border-orange-500/30 bg-orange-500/10">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-300">Vulnerabilities detected:</p>
                    <ul className="text-sm text-orange-200/70 list-disc pl-5 space-y-1 mt-1">
                      {analysis.vulnerabilities.map((vuln, i) => (
                        <li key={i}>{vuln}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {analysis.isBreached && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This password was found in known data breaches. Do not use it.
                </AlertDescription>
              </Alert>
            )}
            
            {analysis.suggestion && analysis.suggestion !== "Your password is already strong!" && (
              <div className="rounded-md p-3 glass border-blue-500/30 bg-blue-500/10">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-300">AI Suggestion:</p>
                    <div className="flex items-center mt-1">
                      <p className="text-sm font-mono bg-blue-900/30 px-2 py-1 rounded flex-1">
                        {analysis.suggestion}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleCopySuggestion}
                        className="glass-button-outline"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
