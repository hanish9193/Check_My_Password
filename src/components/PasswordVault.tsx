
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileDown, Eye, EyeOff, Copy, Trash, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  SavedPassword, 
  getStrengthLabel, 
  getStrengthColor, 
  PasswordStrength
} from "@/lib/password-utils";
import { generatePasswordReport } from "@/lib/pdf-service";

interface PasswordVaultProps {
  passwords: SavedPassword[];
  onDelete: (id: string) => void;
  onUpdate: (password: SavedPassword) => void;
}

export function PasswordVault({ passwords, onDelete, onUpdate }: PasswordVaultProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [editingPassword, setEditingPassword] = useState<SavedPassword | null>(null);

  const handleTogglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Password copied",
      description: "Password has been copied to clipboard",
    });
  };

  const handleEditPassword = (password: SavedPassword) => {
    setEditingPassword({ ...password });
  };

  const handleSaveEdit = () => {
    if (editingPassword) {
      onUpdate(editingPassword);
      setEditingPassword(null);
      toast({
        title: "Password updated",
        description: "Your password details have been updated",
      });
    }
  };

  const handleDeletePassword = (id: string) => {
    onDelete(id);
    toast({
      title: "Password deleted",
      description: "Password has been removed from your vault",
    });
  };

  const handleGenerateReport = () => {
    if (passwords.length === 0) {
      toast({
        title: "No passwords",
        description: "Add some passwords to generate a report",
        variant: "destructive",
      });
      return;
    }

    try {
      generatePasswordReport(passwords);
      toast({
        title: "Report generated",
        description: "Your password report has been downloaded",
      });
    } catch (error) {
      console.error("Error generating report", error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  const filteredPasswords = passwords.filter(
    (password) => password.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card className="glass-card animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Password Vault
          </CardTitle>
          <Button 
            onClick={handleGenerateReport} 
            variant="outline" 
            size="sm"
            disabled={passwords.length === 0}
            className="glass-button-outline"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md glass-input"
            />
          </div>

          {filteredPasswords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground glass rounded-lg p-6">
              {passwords.length === 0 
                ? "No passwords saved yet. Generate and save some passwords." 
                : "No passwords match your search."}
            </div>
          ) : (
            <ScrollArea className="h-[350px] rounded-md glass border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead>Name</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Strength</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPasswords.map((password) => (
                    <TableRow key={password.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium">{password.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono">
                            {showPasswords[password.id] 
                              ? password.password 
                              : "••••••••••••••••"}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleTogglePassword(password.id)}
                            className="glass-button-outline h-7 w-7"
                          >
                            {showPasswords[password.id] ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyPassword(password.password)}
                            className="glass-button-outline h-7 w-7"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getStrengthColor(password.strength)}`} />
                          <span>{getStrengthLabel(password.strength)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(password.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditPassword(password)}
                            className="glass-button-outline h-7 w-7"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePassword(password.id)}
                            className="glass-button-outline h-7 w-7"
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingPassword} onOpenChange={(open) => !open && setEditingPassword(null)}>
        {editingPassword && (
          <DialogContent className="sm:max-w-[425px] glass-card border-white/10">
            <DialogHeader>
              <DialogTitle className="text-gradient">Edit Password</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingPassword.name}
                  onChange={(e) => setEditingPassword({ ...editingPassword, name: e.target.value })}
                  className="col-span-3 glass-input"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={editingPassword.notes || ""}
                  onChange={(e) => setEditingPassword({ ...editingPassword, notes: e.target.value })}
                  className="col-span-3 glass-input"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingPassword(null)} className="glass-button-outline">
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="glass-button">
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
