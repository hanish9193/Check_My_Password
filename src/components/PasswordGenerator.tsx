
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { RefreshCw, Copy, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  PasswordOptions,
  generatePassword,
  analyzePasswordStrength,
  getStrengthColor,
  getStrengthLabel,
  PasswordStrength
} from "@/lib/password-utils";

interface PasswordGeneratorProps {
  onSave: (password: string, strength: PasswordStrength) => void;
}

export function PasswordGenerator({ onSave }: PasswordGeneratorProps) {
  const { toast } = useToast();
  const [password, setPassword] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(PasswordStrength.VeryWeak);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    
    const strength = analyzePasswordStrength(newPassword);
    setPasswordStrength(strength);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Password copied",
      description: "Password has been copied to clipboard",
    });
  };

  const handleSavePassword = () => {
    if (password) {
      onSave(password, passwordStrength);
      toast({
        title: "Password saved",
        description: "Password has been saved to your vault",
      });
    } else {
      toast({
        title: "No password to save",
        description: "Please generate a password first",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Password Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input 
            value={password || "Generate a password"} 
            readOnly 
            className="font-mono glass-input"
          />
          <Button 
            size="icon" 
            variant="outline" 
            onClick={handleCopyPassword}
            disabled={!password}
            className="glass-button-outline"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {password && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex justify-between text-sm">
              <span>Password strength:</span>
              <span className="font-medium">{getStrengthLabel(passwordStrength)}</span>
            </div>
            <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getStrengthColor(passwordStrength)}`}
                style={{ width: `${(passwordStrength + 1) * 20}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Password length: {options.length}</Label>
            </div>
            <Slider
              value={[options.length]}
              min={6}
              max={32}
              step={1}
              onValueChange={(value) => {
                setOptions({ ...options, length: value[0] });
              }}
              className="glass"
            />
          </div>

          <div className="space-y-3 rounded-md p-3 glass">
            <div className="flex items-center justify-between">
              <Label htmlFor="uppercase">Include uppercase letters</Label>
              <Switch
                id="uppercase"
                checked={options.includeUppercase}
                onCheckedChange={(checked) => {
                  setOptions({ ...options, includeUppercase: checked });
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="lowercase">Include lowercase letters</Label>
              <Switch
                id="lowercase"
                checked={options.includeLowercase}
                onCheckedChange={(checked) => {
                  setOptions({ ...options, includeLowercase: checked });
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="numbers">Include numbers</Label>
              <Switch
                id="numbers"
                checked={options.includeNumbers}
                onCheckedChange={(checked) => {
                  setOptions({ ...options, includeNumbers: checked });
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="symbols">Include symbols</Label>
              <Switch
                id="symbols"
                checked={options.includeSymbols}
                onCheckedChange={(checked) => {
                  setOptions({ ...options, includeSymbols: checked });
                }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleGeneratePassword} 
              className="flex-1 glass-button" 
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate
            </Button>
            <Button 
              onClick={handleSavePassword} 
              className="flex-1 glass-button-outline" 
              variant="outline"
              disabled={!password}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
