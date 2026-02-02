import { motion } from "framer-motion";
import { NeonCard } from "@/components/NeonCard";
import { useTeamMembers } from "@/hooks/use-data";
import { Loader2, ShieldCheck, Star } from "lucide-react";

export default function Team() {
  const { data: members, isLoading } = useTeamMembers();

  const founders = members?.filter(m => m.role.toLowerCase() === 'founder') || [];
  const ceos = members?.filter(m => m.role.toLowerCase() === 'chief executive officer' || m.role.toLowerCase() === 'ceo') || [];
  const coos = members?.filter(m => m.role.toLowerCase() === 'chief operating officer' || m.role.toLowerCase() === 'coo') || [];
  const presidents = members?.filter(m => m.role.toLowerCase() === 'president') || [];
  const svps = members?.filter(m => m.role.toLowerCase().includes('senior vice president') || m.role.toLowerCase() === 'svp') || [];
  
  const otherAdmins = members?.filter(m => !m.isVip && 
    m.role.toLowerCase() !== 'founder' &&
    m.role.toLowerCase() !== 'chief executive officer' && 
    m.role.toLowerCase() !== 'ceo' && 
    m.role.toLowerCase() !== 'chief operating officer' && 
    m.role.toLowerCase() !== 'coo' && 
    m.role.toLowerCase() !== 'president' && 
    !m.role.toLowerCase().includes('senior vice president') && 
    m.role.toLowerCase() !== 'svp'
  ) || [];
  const vips = members?.filter(m => m.isVip) || [];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display text-white mb-4 tracking-widest"
          >
            MEET THE TEAM
          </motion.h1>
          <div className="h-1 w-24 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground font-mono max-w-2xl mx-auto uppercase tracking-wider">
            The legends behind the movement. No hierarchy, just family.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-24">
            {/* Founder */}
            {founders.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-display text-white tracking-widest">FOUNDER</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {founders.map((member) => (
                    <TeamMemberCard key={member.id} member={member} variant="primary" />
                  ))}
                </div>
              </section>
            )}

            {/* CEO */}
            {ceos.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-display text-white tracking-widest">CHIEF EXECUTIVE OFFICER</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {ceos.map((member) => (
                    <TeamMemberCard key={member.id} member={member} variant="primary" />
                  ))}
                </div>
              </section>
            )}

            {/* COO */}
            {coos.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-display text-white tracking-widest">CHIEF OPERATING OFFICER</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {coos.map((member) => (
                    <TeamMemberCard key={member.id} member={member} variant="primary" />
                  ))}
                </div>
              </section>
            )}

            {/* President */}
            {presidents.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-display text-white tracking-widest">PRESIDENT</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {presidents.map((member) => (
                    <TeamMemberCard key={member.id} member={member} variant="primary" />
                  ))}
                </div>
              </section>
            )}

            {/* SVP */}
            {svps.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-display text-white tracking-widest">SENIOR VICE PRESIDENT</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {svps.map((member) => (
                    <TeamMemberCard key={member.id} member={member} variant="primary" />
                  ))}
                </div>
              </section>
            )}

            {/* Other Admins */}
            {otherAdmins.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-display text-white tracking-widest">ADMIN TEAM</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherAdmins.map((member) => (
                    <TeamMemberCard key={member.id} member={member} variant="primary" />
                  ))}
                </div>
              </section>
            )}

            {/* Other Admins */}
            {otherAdmins.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-display text-white tracking-widest">ADMIN TEAM</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherAdmins.map((member) => (
                    <TeamMemberCard key={member.id} member={member} variant="primary" />
                  ))}
                </div>
              </section>
            )}

            {/* VIP Members */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <Star className="w-8 h-8 text-secondary" />
                <h2 className="text-3xl font-display text-white tracking-widest">VIP MEMBERS</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {vips.map((member) => (
                  <TeamMemberCard key={member.id} member={member} variant="secondary" />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function TeamMemberCard({ member, variant }: { member: any; variant: "primary" | "secondary" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <NeonCard variant={variant} className="h-full group">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center overflow-hidden">
            {member.avatarUrl ? (
              <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-display text-primary">{member.name[0]}</span>
            )}
          </div>
          <div>
            <h3 className="text-2xl text-white font-display leading-none mb-1 group-hover:text-primary transition-colors">
              {member.name}
            </h3>
            <span className={`text-xs font-mono uppercase tracking-widest ${variant === 'primary' ? 'text-primary' : 'text-secondary'}`}>
              {member.role}
            </span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed font-body">
          {member.bio}
        </p>
      </NeonCard>
    </motion.div>
  );
}
