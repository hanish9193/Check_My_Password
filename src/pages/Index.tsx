
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PasswordGenerator } from "@/components/PasswordGenerator";
import { PasswordVault } from "@/components/PasswordVault";
import { PasswordStrengthChecker } from "@/components/PasswordStrengthChecker";
import { SavePasswordDialog } from "@/components/SavePasswordDialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  SavedPassword,
  PasswordStrength,
  savePassword,
  getPasswords,
  deletePassword,
  updatePassword,
} from "@/lib/password-utils";
import { Button } from "@/components/ui/button";
import { KeyRound, Shield, FileText, Lock } from "lucide-react";

const Index = () => {
  const [passwords, setPasswords] = useState<SavedPassword[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentStrength, setCurrentStrength] = useState<PasswordStrength>(PasswordStrength.VeryWeak);
  const [activeTab, setActiveTab] = useState("generator");

  useEffect(() => {
    // Load passwords from localStorage
    const storedPasswords = getPasswords();
    setPasswords(storedPasswords);
  }, []);

  const handleSavePasswordOpen = (password: string, strength: PasswordStrength) => {
    setCurrentPassword(password);
    setCurrentStrength(strength);
    setSaveDialogOpen(true);
  };

  const handleSavePassword = (name: string, notes: string) => {
    const newPassword: SavedPassword = {
      id: crypto.randomUUID(),
      name,
      password: currentPassword,
      strength: currentStrength,
      createdAt: new Date().toISOString(),
      notes,
    };

    savePassword(newPassword);
    setPasswords([...passwords, newPassword]);
    setSaveDialogOpen(false);
  };

  const handleDeletePassword = (id: string) => {
    deletePassword(id);
    setPasswords(passwords.filter((p) => p.id !== id));
  };

  const handleUpdatePassword = (updatedPassword: SavedPassword) => {
    updatePassword(updatedPassword);
    setPasswords(
      passwords.map((p) => (p.id === updatedPassword.id ? updatedPassword : p))
    );
  };

  return (
    <div className="min-h-screen py-8 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight text-gradient-logo">
            Intelligent Password Analysis
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Generate, analyze, and manage passwords with advanced GenAI and Machine Learning technology
          </p>
          
          <div className="pt-4">
            <Link to="/security">
              <Button className="glass-button">
                <Lock className="mr-2 h-4 w-4" />
                Advanced Security Tools
              </Button>
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass-card grid grid-cols-3 max-w-xl mx-auto">
            <TabsTrigger value="generator" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/20 data-[state=active]:to-accent/20">
              <KeyRound className="h-4 w-4" />
              <span>Generator</span>
            </TabsTrigger>
            <TabsTrigger value="checker" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/20 data-[state=active]:to-accent/20">
              <Shield className="h-4 w-4" />
              <span>AI Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="vault" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/20 data-[state=active]:to-accent/20">
              <FileText className="h-4 w-4" />
              <span>Password Vault</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="generator" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4 hover-scale">
                  <PasswordGenerator onSave={handleSavePasswordOpen} />
                </div>
                <div className="space-y-4 hover-scale">
                  <PasswordStrengthChecker />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="checker">
              <div className="max-w-md mx-auto hover-scale">
                <PasswordStrengthChecker />
              </div>
            </TabsContent>
            
            <TabsContent value="vault">
              <div className="hover-scale">
                <PasswordVault
                  passwords={passwords}
                  onDelete={handleDeletePassword}
                  onUpdate={handleUpdatePassword}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <SavePasswordDialog
        isOpen={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={handleSavePassword}
        password={currentPassword}
        strength={currentStrength}
      />

      <footer className="mt-16 text-center text-sm text-white/60">
        <p>All password data is stored locally on your device.</p>
        <p className="mt-1">© {new Date().getFullYear()} Intelligent Password Analysis</p>
      </footer>
    </div>
  );
};

export default Index;
