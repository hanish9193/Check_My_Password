
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PasswordStrength } from "@/lib/password-utils";

interface SavePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, notes: string) => void;
  password: string;
  strength: PasswordStrength;
}

export function SavePasswordDialog({
  isOpen,
  onClose,
  onSave,
  password,
  strength,
}: SavePasswordDialogProps) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    onSave(name, notes);
    setName("");
    setNotes("");
  };

  const handleClose = () => {
    onClose();
    setName("");
    setNotes("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] glass-card border-white/10 animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-xl text-gradient-logo">
            Save Password
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name / Site</Label>
            <Input
              id="name"
              placeholder="e.g. Gmail, Twitter"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="glass-input"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              value={password}
              className="font-mono glass-input"
              readOnly
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this password"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none glass-input min-h-[80px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} className="glass-button-outline">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()} className="glass-button">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
