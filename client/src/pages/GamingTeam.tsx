import { motion } from "framer-motion";
import { useRoute } from "wouter";
import { Swords } from "lucide-react";

const teamInfo: Record<string, { name: string; color: string; description: string }> = {
  fc: {
    name: "FC Team",
    color: "#22CC22",
    description: "Our competitive FC squad bringing the heat on the virtual pitch. Whether it's Pro Clubs or Ultimate Team, we play to win.",
  },
  racing: {
    name: "Racing Team",
    color: "#FF8800",
    description: "Speed demons of Bally Up Gang. From Formula tracks to street circuits, our racing crew pushes every lap to the limit.",
  },
  cod: {
    name: "Call of Duty Team",
    color: "#FF2222",
    description: "Bally Up Gang's Call of Duty division. Dominating lobbies in Warzone, multiplayer, and ranked play.",
  },
};

export default function GamingTeamPage() {
  const [, params] = useRoute("/teams/:slug");
  const slug = params?.slug || "";
  const team = teamInfo[slug];

  if (!team) {
    return (
      <div className="min-h-screen pt-28 pb-24 flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Team not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 border-2" style={{ borderColor: team.color, background: `${team.color}15` }}>
            <Swords className="w-10 h-10" style={{ color: team.color }} />
          </div>
          <h1 className="text-4xl md:text-6xl font-display uppercase tracking-widest mb-4" style={{ color: team.color }}>
            {team.name}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            {team.description}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-xl border border-primary/20 p-8 text-center" style={{ background: "rgba(0,0,0,0.4)" }}>
          <h2 className="text-2xl font-display uppercase tracking-widest text-primary mb-4">Coming Soon</h2>
          <p className="text-muted-foreground">
            Team roster, stats, and match schedules will be added here. Stay tuned!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
