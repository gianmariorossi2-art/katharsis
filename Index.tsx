import { useState } from "react";
import { Header } from "@/components/Header";
import { FeatureNav } from "@/components/FeatureNav";
import { AuraScanner } from "@/components/AuraScanner";
import { EnvyDetector } from "@/components/EnvyDetector";
import { OracleChat } from "@/components/OracleChat";

const Index = () => {
  const [activeFeature, setActiveFeature] = useState("aura");

  const renderFeature = () => {
    switch (activeFeature) {
      case "aura":
        return <AuraScanner />;
      case "envy":
        return <EnvyDetector />;
      case "oracle":
        return <OracleChat />;
      default:
        return <AuraScanner />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cosmic-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-mystic-gold/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-48 h-48 bg-energy-cyan/5 rounded-full blur-2xl" />
      </div>

      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24 relative z-10">
        <div className="max-w-md mx-auto">
          {renderFeature()}
        </div>

      {/* Disclaimer & Manifesto Link */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-[10px] text-muted-foreground/50 max-w-sm mx-auto">
            App for entertainment purposes only. No scientific guarantee derived from the use of this software.
          </p>
          <a 
            href="/manifesto" 
            className="inline-block text-xs text-muted-foreground/40 hover:text-mystic-gold transition-colors duration-300 tracking-widest uppercase"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Manifesto & Ethics
          </a>
        </div>
      </main>

      <FeatureNav activeFeature={activeFeature} onFeatureChange={setActiveFeature} />
    </div>
  );
};

export default Index;
