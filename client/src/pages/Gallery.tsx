import { useGallery, useCreateGalleryItem } from "@/hooks/use-data";
import { NeonCard } from "@/components/NeonCard";
import { Plus, Loader2, Play, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function Gallery() {
  const { data: items, isLoading } = useGallery();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { id: "streaks", title: "BEST MOMENTS & WIN STREAKS", description: "LOGOS, BANNERS & EPIC WINS" },
    { id: "fc_moments", title: "BEST FC MOMENTS", description: "FOOTBALL CLUB HIGHLIGHTS" },
    { id: "general", title: "MEDIA GALLERY", description: "CLIPS, PICS & HIGHLIGHTS" },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-display text-white mb-2">GALLERY</h1>
            <p className="text-muted-foreground font-mono font-bold tracking-widest">BUILT FOR THE GANG</p>
          </div>
          
          {user && (
            <CreateGalleryDialog open={isOpen} onOpenChange={setIsOpen} />
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
          </div>
        ) : (
          <div className="space-y-16">
            {categories.map((category) => {
              const categoryItems = items?.filter(item => (item.category === category.id) || (category.id === 'general' && !item.category)) || [];
              if (category.id !== 'general' && categoryItems.length === 0) return null;
              
              return (
                <div key={category.id} className="space-y-8">
                  <div className="border-l-4 border-accent pl-4">
                    <h2 className="text-2xl md:text-3xl font-display text-white">{category.title}</h2>
                    <p className="text-muted-foreground font-mono text-xs">{category.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryItems.map((item) => (
                      <NeonCard key={item.id} variant="primary" className="p-0 overflow-hidden group border-0 bg-black">
                        <div className="relative aspect-video">
                          {item.type === 'video' ? (
                            <>
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors z-10">
                                <Play className="w-12 h-12 text-white opacity-80 group-hover:scale-110 transition-transform" />
                              </div>
                              <img 
                                src={`https://img.youtube.com/vi/${getYouTubeId(item.url)}/hqdefault.jpg`} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop";
                                }}
                              />
                            </>
                          ) : (
                            <img 
                              src={item.url} 
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent z-20">
                            <h3 className="text-white font-display text-lg drop-shadow-md">{item.title}</h3>
                          </div>
                        </div>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-30" />
                      </NeonCard>
                    ))}

                    {categoryItems.length === 0 && category.id === 'general' && (
                      <div className="col-span-full text-center py-20 text-muted-foreground font-mono">
                        GALLERY EMPTY. UPLOAD SOMETHING.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function CreateGalleryDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { mutate, isPending } = useCreateGalleryItem();
  const { toast } = useToast();
  const [type, setType] = useState("image");
  
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    mutate({
      title: formData.get("title") as string,
      url: formData.get("url") as string,
      type: type,
      category: formData.get("category") as string,
    }, {
      onSuccess: () => {
        toast({ title: "Success", description: "Item added to gallery!" });
        onOpenChange(false);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to add item", variant: "destructive" });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent border border-accent hover:bg-accent hover:text-white transition-all font-display text-sm uppercase">
          <Plus className="w-4 h-4" /> Add Media
        </button>
      </DialogTrigger>
      <DialogContent className="bg-background border-accent/20 text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-accent">Add To Gallery</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select name="category" defaultValue="general">
              <SelectTrigger className="bg-black/50 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="streaks">Best Moments & Win Streaks</SelectItem>
                <SelectItem value="fc_moments">Best FC Moments</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Media Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-black/50 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image URL</SelectItem>
                <SelectItem value="video">Video URL (YouTube)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input name="title" required placeholder="Epic win moment" className="bg-black/50 border-white/10" />
          </div>
          
          <div className="space-y-2">
            <Label>URL</Label>
            <Input name="url" type="url" required placeholder="https://..." className="bg-black/50 border-white/10" />
            <p className="text-xs text-muted-foreground">For videos, use full YouTube link.</p>
          </div>

          <button 
            disabled={isPending}
            className="w-full py-3 bg-accent text-white font-display uppercase hover:bg-accent/80 transition-colors disabled:opacity-50"
          >
            {isPending ? "Uploading..." : "Add to Gallery"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
