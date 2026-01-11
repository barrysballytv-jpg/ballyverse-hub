import { useEvents, useCreateEvent } from "@/hooks/use-data";
import { NeonCard } from "@/components/NeonCard";
import { Plus, Calendar, MapPin, Loader2, Trophy } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

export default function Events() {
  const { data: events, isLoading } = useEvents();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Sort events by date
  const sortedEvents = events?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-display text-white mb-2">EVENTS & DROPS</h1>
            <p className="text-muted-foreground font-mono">MARK YOUR CALENDARS</p>
          </div>
          
          {user && (
            <CreateEventDialog open={isOpen} onOpenChange={setIsOpen} />
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-secondary animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {sortedEvents?.map((event) => (
              <NeonCard 
                key={event.id} 
                variant={event.type === 'giveaway' ? 'primary' : 'secondary'}
                className="flex flex-col md:flex-row gap-6 items-start md:items-center"
              >
                {/* Date Badge */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 bg-black/50 border border-white/10 rounded-sm text-center p-2">
                  <span className="text-xs font-mono text-muted-foreground uppercase">{format(new Date(event.date), "MMM")}</span>
                  <span className="text-3xl font-display text-white">{format(new Date(event.date), "dd")}</span>
                  <span className="text-xs font-mono text-muted-foreground">{format(new Date(event.date), "yyyy")}</span>
                </div>

                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-3 mb-1">
                    {event.type === 'giveaway' ? (
                      <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary text-[10px] font-display uppercase tracking-wider flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> Giveaway
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-secondary/20 text-secondary border border-secondary text-[10px] font-display uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Event
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {event.location || "Online"}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-display text-white">{event.title}</h3>
                  <p className="text-muted-foreground text-sm max-w-xl">
                    {event.description}
                  </p>
                </div>

                <button className="w-full md:w-auto px-6 py-3 bg-white/5 border border-white/10 hover:bg-white hover:text-black hover:border-white transition-all font-display text-sm uppercase whitespace-nowrap">
                  Details
                </button>
              </NeonCard>
            ))}

            {(!events || events.length === 0) && (
              <div className="text-center py-20 bg-black/20 border border-white/5 p-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl text-white font-display mb-2">No Upcoming Events</h3>
                <p className="text-muted-foreground font-mono">Check back later for new drops.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CreateEventDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { mutate, isPending } = useCreateEvent();
  const { toast } = useToast();
  const [eventType, setEventType] = useState("event");
  
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Zod expects Date object, JSON will stringify, but standard fetch handles this
    mutate({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: new Date(formData.get("date") as string),
      location: formData.get("location") as string,
      type: eventType,
    }, {
      onSuccess: () => {
        toast({ title: "Success", description: "Event created!" });
        onOpenChange(false);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to create event", variant: "destructive" });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary/20 text-secondary border border-secondary hover:bg-secondary hover:text-black transition-all font-display text-sm uppercase">
          <Plus className="w-4 h-4" /> New Event
        </button>
      </DialogTrigger>
      <DialogContent className="bg-background border-secondary/20 text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-secondary">Post New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger className="bg-black/50 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="giveaway">Giveaway</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input name="date" type="datetime-local" required className="bg-black/50 border-white/10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Event Title</Label>
            <Input name="title" required placeholder="Saturday Night Gaming" className="bg-black/50 border-white/10" />
          </div>
          
          <div className="space-y-2">
            <Label>Location</Label>
            <Input name="location" placeholder="Discord Voice #1 / Twitch" className="bg-black/50 border-white/10" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea name="description" required placeholder="Event details..." className="bg-black/50 border-white/10" />
          </div>

          <button 
            disabled={isPending}
            className="w-full py-3 bg-secondary text-black font-display uppercase hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            {isPending ? "Posting..." : "Create Event"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
