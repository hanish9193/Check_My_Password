
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import { PasswordHashChecker } from "@/components/PasswordHashChecker";
import { BulkPasswordChecker } from "@/components/BulkPasswordChecker";
import { PasswordStrengthChecker } from "@/components/PasswordStrengthChecker";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Hash, FileText, Shield } from "lucide-react";

const SecurityTools = () => {
  const [activeTab, setActiveTab] = useState("analyzer");
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* Custom Spline background for security tools page */}
      <div className="fixed inset-0 -z-10">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2"></div>
          </div>
        )}
        <Spline
          scene="https://prod.spline.design/A-XKRaReBXXMpUio/scene.splinecode"
          onLoad={() => setLoading(false)}
          className="w-full h-full"
        />
        {/* Watermark cover - positioned at bottom-right corner with black background */}
        <div className="absolute bottom-0 right-0 w-52 h-20 bg-black z-10"></div>
      </div>

      <div className="min-h-screen py-8 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="outline" size="sm" className="glass-button-outline mr-4">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            
            <h1 className="text-3xl font-bold tracking-tight text-gradient-logo">
              Security Tools
            </h1>
          </div>

          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold tracking-tight">
              Advanced Password Security Suite
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Analyze, hash, and test passwords with industry-standard cryptographic algorithms
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="glass-card grid grid-cols-3 max-w-xl mx-auto">
              <TabsTrigger value="analyzer" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/20 data-[state=active]:to-accent/20">
                <Shield className="h-4 w-4" />
                <span>AI Analyzer</span>
              </TabsTrigger>
              <TabsTrigger value="hashing" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/20 data-[state=active]:to-accent/20">
                <Hash className="h-4 w-4" />
                <span>Hash Tool</span>
              </TabsTrigger>
              <TabsTrigger value="bulk" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/20 data-[state=active]:to-accent/20">
                <FileText className="h-4 w-4" />
                <span>Bulk Check</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="analyzer" className="space-y-8">
                <div className="max-w-md mx-auto hover-scale">
                  <PasswordStrengthChecker />
                </div>
              </TabsContent>
              
              <TabsContent value="hashing">
                <div className="max-w-md mx-auto hover-scale">
                  <PasswordHashChecker />
                </div>
              </TabsContent>
              
              <TabsContent value="bulk">
                <div className="hover-scale">
                  <BulkPasswordChecker />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>All processing is done locally in your browser for maximum privacy.</p>
          <p className="mt-1">© {new Date().getFullYear()} Intelligent Password Security Suite</p>
        </footer>
      </div>
    </>
  );
};

export default SecurityTools;
