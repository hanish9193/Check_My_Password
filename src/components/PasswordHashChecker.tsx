
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, FileText, Lock, Shield } from "lucide-react";
import { hashWithBcrypt, hashWithSHA256, verifyBcryptPassword } from "@/lib/hash-utils";
import { analyzePasswordWithAI } from "@/lib/ai-password-service";
import { useToast } from "@/hooks/use-toast";

export function PasswordHashChecker() {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [bcryptHash, setBcryptHash] = useState("");
  const [sha256Hash, setSha256Hash] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [hashType, setHashType] = useState<"bcrypt" | "sha256">("bcrypt");

  const handleGenerateHash = () => {
    if (!password) {
      toast({
        title: "Error",
        description: "Please enter a password to hash",
        variant: "destructive",
      });
      return;
    }

    try {
      if (hashType === "bcrypt") {
        const result = hashWithBcrypt(password);
        setBcryptHash(result.hash);
      } else {
        const result = hashWithSHA256(password);
        setSha256Hash(result.hash);
      }

      toast({
        title: "Success",
        description: `${hashType.toUpperCase()} hash generated successfully`,
      });
    } catch (error) {
      console.error("Hash error:", error);
      toast({
        title: "Error",
        description: "Failed to generate hash",
        variant: "destructive",
      });
    }
  };

  const handleVerifyHash = () => {
    if (!verifyPassword || !verifyHash) {
      toast({
        title: "Error",
        description: "Please enter both password and hash to verify",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = verifyBcryptPassword(verifyPassword, verifyHash);
      setVerifyResult(result);
      
      toast({
        title: result ? "Match" : "No Match",
        description: result 
          ? "Password matches the hash" 
          : "Password does not match the hash",
        variant: result ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Error",
        description: "Failed to verify hash, ensure it's a valid bcrypt hash",
        variant: "destructive",
      });
      setVerifyResult(null);
    }
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast({
      title: "Copied",
      description: "Hash copied to clipboard",
    });
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Password Hashing Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="glass-card grid grid-cols-2">
            <TabsTrigger value="generate" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/20 data-[state=active]:to-accent/20">
              <Lock className="h-4 w-4" />
              <span>Generate Hash</span>
            </TabsTrigger>
            <TabsTrigger value="verify" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/20 data-[state=active]:to-accent/20">
              <Shield className="h-4 w-4" />
              <span>Verify Hash</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="password">Password to Hash</Label>
              <Input
                id="password"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to hash"
                className="glass-input mt-2"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Hash Algorithm</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="bcrypt" 
                    value="bcrypt" 
                    checked={hashType === "bcrypt"} 
                    onChange={() => setHashType("bcrypt")}
                    className="rounded-full"
                  />
                  <Label htmlFor="bcrypt">bcrypt</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="sha256" 
                    value="sha256" 
                    checked={hashType === "sha256"} 
                    onChange={() => setHashType("sha256")}
                    className="rounded-full"
                  />
                  <Label htmlFor="sha256">SHA-256</Label>
                </div>
              </div>
            </div>
            
            <Button onClick={handleGenerateHash} className="glass-button w-full">
              <Lock className="mr-2 h-4 w-4" />
              Generate Hash
            </Button>
            
            {(bcryptHash || sha256Hash) && (
              <div className="mt-4 space-y-4 animate-fade-in">
                {bcryptHash && (
                  <div className="space-y-2">
                    <Label>bcrypt Hash</Label>
                    <div className="flex space-x-2">
                      <Input 
                        value={bcryptHash} 
                        readOnly 
                        className="font-mono glass-input text-xs"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleCopyHash(bcryptHash)}
                        className="glass-button-outline"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {sha256Hash && (
                  <div className="space-y-2">
                    <Label>SHA-256 Hash</Label>
                    <div className="flex space-x-2">
                      <Input 
                        value={sha256Hash} 
                        readOnly 
                        className="font-mono glass-input text-xs"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleCopyHash(sha256Hash)}
                        className="glass-button-outline"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="verify" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="verify-password">Password to Verify</Label>
              <Input
                id="verify-password"
                type="text"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                placeholder="Enter password"
                className="glass-input mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="verify-hash">bcrypt Hash</Label>
              <Input
                id="verify-hash"
                type="text"
                value={verifyHash}
                onChange={(e) => setVerifyHash(e.target.value)}
                placeholder="Enter bcrypt hash"
                className="glass-input mt-2 font-mono text-xs"
              />
            </div>
            
            <Button onClick={handleVerifyHash} className="glass-button w-full">
              <Shield className="mr-2 h-4 w-4" />
              Verify Password
            </Button>
            
            {verifyResult !== null && (
              <div className={`rounded-md p-3 ${verifyResult ? 'bg-success/10 border-success/30' : 'bg-destructive/10 border-destructive/30'} glass animate-fade-in`}>
                <p className="text-sm">
                  {verifyResult 
                    ? "✓ Password matches the hash" 
                    : "✗ Password does not match the hash"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
