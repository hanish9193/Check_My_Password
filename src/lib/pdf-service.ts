
import { jsPDF } from "jspdf";
import { SavedPassword, getStrengthLabel } from "./password-utils";
import { analyzePasswordWithAI } from "./ai-password-service";

export function generatePasswordReport(passwords: SavedPassword[]): void {
  const doc = new jsPDF();
  let currentY = 20; // Starting Y position
  
  // Title with new logo colors
  doc.setFontSize(24);
  doc.setTextColor(255, 192, 80); // Primary color - golden yellow
  doc.text("Intelligent Password Generator [2025]", 20, currentY);
  currentY += 15;
  
  // Subtitle with rating
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("★★★★★ Advanced Security Analysis", 20, currentY);
  currentY += 15;
  
  // Description
  doc.setFontSize(11);
  doc.setTextColor(70, 70, 70);
  const descText = "Generate strong passwords that are easy to remember using AI-powered analysis.";
  doc.text(descText, 20, currentY);
  currentY += 10;
  
  // Features - improved alignment
  doc.setFontSize(11);
  doc.setTextColor(255, 100, 100); // Accent color - reddish
  doc.text("✓ GenAI Security Analysis", 20, currentY);
  doc.text("✓ Machine Learning", 100, currentY);
  doc.text("✓ Breach Detection", 170, currentY);
  currentY += 20;
  
  // Password List
  if (passwords.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(255, 192, 80); // Primary color
    doc.text("Generated Passwords", 20, currentY);
    currentY += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    passwords.forEach((password, index) => {
      // Add a new page if we're near the bottom
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
      
      // Get AI analysis for this password
      const analysis = analyzePasswordWithAI(password.password);
      
      // Improved alignment for password details
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(12);
      doc.text(`${password.name}`, 20, currentY);
      
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text(`Created: ${new Date(password.createdAt).toLocaleDateString()}`, 20, currentY + 5);
      
      // Better password alignment with fixed position
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      let passwordText = password.password;
      // If password is too long, truncate it
      if (passwordText.length > 25) {
        passwordText = passwordText.substring(0, 22) + "...";
      }
      doc.text(passwordText, 170, currentY, { align: "right" });
      
      // Better positioned Copy button
      doc.setDrawColor(255, 192, 80);
      doc.setFillColor(255, 192, 80, 0.1);
      doc.roundedRect(175, currentY - 8, 15, 10, 2, 2, "FD");
      doc.setFontSize(6);
      doc.setTextColor(255, 192, 80);
      doc.text("COPY", 182.5, currentY - 2, { align: "center" });
      
      // Strength indicator with clearer alignment
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`Strength: ${getStrengthLabel(password.strength)}`, 20, currentY + 12);
      
      // AI analysis: Time to crack - aligned
      doc.setFontSize(9);
      doc.setTextColor(255, 100, 100); // Accent color
      doc.text(`Time to crack: ${analysis.timeToCrack}`, 90, currentY + 12);
      
      // AI analysis: Entropy - aligned
      doc.setFontSize(9);
      doc.setTextColor(255, 100, 100); // Accent color
      doc.text(`Entropy: ${analysis.entropyBits} bits`, 170, currentY + 12, { align: "right" });
      
      // Notes section
      currentY += 18;
      
      if (analysis.vulnerabilities.length > 0) {
        doc.setFontSize(9);
        doc.setTextColor(180, 70, 70);
        doc.text(`Vulnerabilities:`, 20, currentY);
        currentY += 5;
        
        analysis.vulnerabilities.forEach((vuln, i) => {
          // Check if we need a new page
          if (currentY > 270) {
            doc.addPage();
            currentY = 20;
          }
          
          doc.setFontSize(8);
          doc.setTextColor(120, 70, 70);
          doc.text(`• ${vuln}`, 25, currentY);
          currentY += 5;
        });
      }
      
      if (password.notes) {
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        
        // Handle multi-line notes with proper wrapping
        const notesLines = doc.splitTextToSize(`Notes: ${password.notes}`, 150);
        doc.text(notesLines, 20, currentY);
        currentY += (notesLines.length * 5) + 5;
      }
      
      currentY += 10;
    });
  }
  
  // Check if we need a new page
  if (currentY > 220) {
    doc.addPage();
    currentY = 20;
  }
  
  // GenAI and Machine Learning Section with new colors
  doc.setFontSize(16);
  doc.setTextColor(255, 192, 80); // Primary color
  doc.text("Password Security with GenAI & Machine Learning", 20, currentY);
  currentY += 12;
  
  // GenAI Features
  doc.setFontSize(12);
  doc.setTextColor(255, 150, 80); // Mix of primary and accent
  doc.text("GenAI-Powered Analysis", 20, currentY);
  currentY += 8;
  
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text("• Pattern Recognition", 30, currentY);
  currentY += 6;
  doc.text("  Identifies common patterns in passwords that make them vulnerable", 30, currentY);
  currentY += 8;
  
  doc.text("• Breach Detection", 30, currentY);
  currentY += 6;
  doc.text("  Cross-references with known data breaches", 30, currentY);
  currentY += 8;
  
  doc.text("• Entropy Analysis", 30, currentY);
  currentY += 6;
  doc.text("  Calculates true randomness using information theory", 30, currentY);
  currentY += 14;
  
  // Machine Learning Features
  doc.setFontSize(12);
  doc.setTextColor(255, 100, 100); // Accent color
  doc.text("Machine Learning Capabilities", 20, currentY);
  currentY += 8;
  
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text("• Time-to-Crack Estimation", 30, currentY);
  currentY += 6;
  doc.text("  Predicts password cracking time using ML models", 30, currentY);
  currentY += 8;
  
  doc.text("• Intelligent Suggestions", 30, currentY);
  currentY += 6;
  doc.text("  Generates secure alternatives preserving memorability", 30, currentY);
  currentY += 8;
  
  doc.text("• Adaptive Analysis", 30, currentY);
  currentY += 6;
  doc.text("  Improves analysis with each password evaluation", 30, currentY);
  currentY += 15;
  
  // Check if we need a new page
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }
  
  // How It Works - improved layout
  doc.setFontSize(16);
  doc.setTextColor(255, 192, 80); // Primary color
  doc.text("How It Works", 20, currentY);
  currentY += 10;
  
  doc.setFontSize(12);
  doc.setTextColor(255, 150, 80); // Mix of primary and accent
  doc.text("Advanced Analysis Technology", 20, currentY);
  currentY += 8;
  
  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);
  const personalContextText = 
    "Our system leverages generative AI and machine learning models trained on vast " +
    "datasets of password breaches. It uses information theory to calculate entropy " +
    "and identifies vulnerabilities that hackers could exploit. The ML model predicts " +
    "cracking time based on modern computational capabilities and suggests secure " +
    "alternatives that maintain memorability.";
  
  const textLines = doc.splitTextToSize(personalContextText, 170);
  doc.text(textLines, 20, currentY);
  currentY += textLines.length * 6 + 10;
  
  // FAQ section
  doc.setFontSize(16);
  doc.setTextColor(255, 192, 80); // Primary color
  doc.text("Frequently Asked Questions", 20, currentY);
  currentY += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(255, 150, 80); // Mix of primary and accent
  doc.text("How accurate is the AI analysis?", 20, currentY);
  currentY += 8;
  
  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);
  const faqText = 
    "The AI analysis is based on contemporary cryptographic principles, " +
    "information theory, and real-world breach data. The time-to-crack " +
    "estimates assume high-end consumer hardware in 2024. While no analysis " +
    "is perfect, our GenAI and ML approach provides significantly more " +
    "accurate assessment than traditional character-counting methods.";
  
  const faqLines = doc.splitTextToSize(faqText, 170);
  doc.text(faqLines, 20, currentY);
  
  // Footer with date and branding colors
  doc.setFontSize(8);
  doc.setTextColor(255, 192, 80, 0.7); // Primary color with transparency
  doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 20, 290);
  
  // Save the PDF
  doc.save("intelligent-password-report.pdf");
}
