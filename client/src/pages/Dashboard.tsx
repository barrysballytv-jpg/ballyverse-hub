import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Trophy, ShoppingBag, Gamepad2, User, LogOut } from "lucide-react";
import { Link } from "wouter";
import type { Score, Preorder, Merchandise } from "@shared/schema";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  const { data: scores = [], isLoading: scoresLoading } = useQuery<Score[]>({
    queryKey: ["/api/scores/me"],
    enabled: isAuthenticated,
  });

  const { data: preorders = [], isLoading: preordersLoading } = useQuery<Preorder[]>({
    queryKey: ["/api/preorders/me"],
    enabled: isAuthenticated,
  });

  const { data: merchandise = [] } = useQuery<Merchandise[]>({
    queryKey: ["/api/merchandise"],
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-pulse font-display text-primary text-2xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="font-display text-4xl text-white">ACCESS DENIED</h1>
          <p className="text-muted-foreground text-lg">You need to sign in to view your dashboard.</p>
          <a
            href="/api/login"
            data-testid="link-login-dashboard"
            className="inline-block px-8 py-4 bg-primary text-black font-display text-lg uppercase tracking-wider hover:bg-white transition-all"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const getMerchName = (merchandiseId: number) => {
    const item = merchandise.find((m) => m.id === merchandiseId);
    return item?.name || `Item #${merchandiseId}`;
  };

  const clickerScores = scores.filter((s) => s.game === "clicker");
  const pinballScores = scores.filter((s) => s.game === "pinball");
  const topClicker = clickerScores.length > 0 ? Math.max(...clickerScores.map((s) => s.score)) : 0;
  const topPinball = pinballScores.length > 0 ? Math.max(...pinballScores.map((s) => s.score)) : 0;

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full border-2 border-primary"
                    data-testid="img-user-avatar"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                )}
                <div>
                  <h1 className="font-display text-3xl md:text-4xl text-white tracking-wider" data-testid="text-user-name">
                    {user?.firstName || "Gang Member"}
                    {user?.lastName ? ` ${user.lastName}` : ""}
                  </h1>
                  <p className="text-muted-foreground text-sm" data-testid="text-user-email">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => logout()}
                data-testid="button-logout"
                className="px-4 py-2 bg-destructive/20 text-destructive border border-destructive hover:bg-destructive hover:text-white transition-all font-display text-xs uppercase flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-card border border-primary/20 rounded-lg p-6 text-center">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-display text-3xl text-primary" data-testid="text-total-games">{scores.length}</div>
                <div className="text-muted-foreground text-sm uppercase tracking-wider">Games Played</div>
              </div>
              <div className="bg-card border border-secondary/20 rounded-lg p-6 text-center">
                <Gamepad2 className="w-8 h-8 text-secondary mx-auto mb-2" />
                <div className="font-display text-3xl text-secondary" data-testid="text-top-clicker">{topClicker.toLocaleString()}</div>
                <div className="text-muted-foreground text-sm uppercase tracking-wider">Best Clicker</div>
              </div>
              <div className="bg-card border border-accent/20 rounded-lg p-6 text-center">
                <Gamepad2 className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="font-display text-3xl text-accent" data-testid="text-top-pinball">{topPinball.toLocaleString()}</div>
                <div className="text-muted-foreground text-sm uppercase tracking-wider">Best Pinball</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card border border-primary/20 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-primary/10 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-lg text-white uppercase tracking-wider">Score History</h2>
                </div>
                <div className="p-4">
                  {scoresLoading ? (
                    <div className="text-muted-foreground text-center py-8 animate-pulse">Loading scores...</div>
                  ) : scores.length === 0 ? (
                    <div className="text-center py-8 space-y-4">
                      <p className="text-muted-foreground">No scores yet!</p>
                      <Link href="/games/clicker">
                        <div className="inline-block px-6 py-2 bg-primary/20 text-primary border border-primary/40 hover:bg-primary hover:text-black transition-all font-display text-xs uppercase cursor-pointer" data-testid="link-play-games">
                          Play Now
                        </div>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {scores.slice(0, 20).map((score) => (
                        <div key={score.id} className="flex items-center justify-between py-2 px-3 bg-background/50 rounded" data-testid={`row-score-${score.id}`}>
                          <div className="flex items-center gap-3">
                            <span className={`font-display text-xs uppercase ${score.game === "clicker" ? "text-primary" : "text-secondary"}`}>
                              {score.game}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-display text-lg text-white">{score.score.toLocaleString()}</span>
                            <span className="text-muted-foreground text-xs">
                              {score.createdAt ? new Date(score.createdAt).toLocaleDateString() : ""}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-card border border-secondary/20 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-secondary/10 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-secondary" />
                  <h2 className="font-display text-lg text-white uppercase tracking-wider">Pre-Orders</h2>
                </div>
                <div className="p-4">
                  {preordersLoading ? (
                    <div className="text-muted-foreground text-center py-8 animate-pulse">Loading preorders...</div>
                  ) : preorders.length === 0 ? (
                    <div className="text-center py-8 space-y-4">
                      <p className="text-muted-foreground">No pre-orders yet!</p>
                      <Link href="/merch">
                        <div className="inline-block px-6 py-2 bg-secondary/20 text-secondary border border-secondary/40 hover:bg-secondary hover:text-black transition-all font-display text-xs uppercase cursor-pointer" data-testid="link-browse-merch">
                          Browse Merch
                        </div>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {preorders.map((po) => (
                        <div key={po.id} className="flex items-center justify-between py-2 px-3 bg-background/50 rounded" data-testid={`row-preorder-${po.id}`}>
                          <div>
                            <span className="text-white text-sm">{getMerchName(po.merchandiseId)}</span>
                            <span className="text-muted-foreground text-xs ml-2">x{po.quantity}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`font-display text-xs uppercase px-2 py-1 rounded ${
                              po.status === "pending" ? "bg-primary/20 text-primary" :
                              po.status === "confirmed" ? "bg-secondary/20 text-secondary" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {po.status}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {po.createdAt ? new Date(po.createdAt).toLocaleDateString() : ""}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
