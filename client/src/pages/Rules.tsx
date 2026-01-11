import { NeonCard } from "@/components/NeonCard";
import { ShieldCheck, MessageSquareOff, UserX, Heart } from "lucide-react";

export default function Rules() {
  const rules = [
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Respect Everyone",
      description: "No hate speech, racism, sexism, or harassment of any kind. We are here to lift each other up."
    },
    {
      icon: <MessageSquareOff className="w-8 h-8 text-secondary" />,
      title: "No Spamming",
      description: "Keep the chat clean. No excessive caps, repeated messages, or self-promo without permission."
    },
    {
      icon: <UserX className="w-8 h-8 text-accent" />,
      title: "No Drama",
      description: "Keep personal disputes private. Don't bring toxicity into the community channels."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "Listen to Mods",
      description: "Moderators have the final say. If they ask you to stop, you stop. Appeals can be made via ticket."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display text-white mb-4">COMMUNITY RULES</h1>
          <p className="text-xl text-muted-foreground font-mono max-w-2xl mx-auto">
            FOLLOW THE CODE. STAY IN THE GANG.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rules.map((rule, idx) => (
            <NeonCard key={idx} variant={idx % 2 === 0 ? "primary" : "secondary"} className="bg-black/60">
              <div className="flex items-start gap-6">
                <div className="p-3 bg-white/5 rounded-sm border border-white/10">
                  {rule.icon}
                </div>
                <div>
                  <h3 className="text-xl font-display text-white mb-2">{rule.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>
            </NeonCard>
          ))}
        </div>

        <div className="mt-16 p-8 border border-destructive/50 bg-destructive/5 rounded-sm text-center">
          <h3 className="text-2xl font-display text-destructive mb-4">ZERO TOLERANCE POLICY</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Violation of these rules may result in a temporary mute, kick, or permanent ban depending on severity.
            Ignorance of the rules is not an excuse.
          </p>
        </div>
      </div>
    </div>
  );
}
