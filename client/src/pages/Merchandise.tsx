import { useMerchandise, useCreateMerchandise } from "@/hooks/use-data";
import { NeonCard } from "@/components/NeonCard";
import { Plus, Loader2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import hoodie1 from "@assets/IMG_4074_1768367634878.jpeg";
import hoodie2 from "@assets/IMG_4073_1768367634878.jpeg";

const COMING_SOON_ITEMS = [
  {
    id: 'cs-1',
    name: "BuG Limited Hoodie v1",
    description: "Exclusive Bally Up Gang limited edition hoodie. Premium heavy-weight fabric with high-density 'BuG' print. The ultimate piece for the movement.",
    imageUrl: hoodie1,
    comingSoon: true
  },
  {
    id: 'cs-2',
    name: "BuG Streetwear Crewneck",
    description: "Clean, bold, and essential. The classic Bally Up Gang crewneck featuring our signature typography. Built for comfort and clout.",
    imageUrl: hoodie2,
    comingSoon: true
  }
];

export default function Merchandise() {
  const { data: items, isLoading } = useMerchandise();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-display text-white mb-2">MERCH DROP</h1>
            <p className="text-muted-foreground font-mono">LIMITED EDITION GEAR FOR THE GANG</p>
          </div>
          
          {user && (
            <CreateMerchDialog open={isOpen} onOpenChange={setIsOpen} />
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Real Items from DB */}
            {items?.map((item) => (
              <NeonCard key={item.id} variant="accent" className="flex flex-col h-full group">
                <div className="relative aspect-square mb-6 overflow-hidden bg-black/50 border border-white/5">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur px-3 py-1 text-white font-mono border border-accent">
                    ${(item.price / 100).toFixed(2)}
                  </div>
                </div>
                
                <h3 className="text-2xl text-white font-display mb-2">{item.name}</h3>
                <p className="text-muted-foreground text-sm flex-grow mb-6 line-clamp-3">
                  {item.description}
                </p>
                
                {item.buyLink ? (
                  <a 
                    href={item.buyLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-accent text-white font-display uppercase tracking-wider text-center hover:bg-white hover:text-accent transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Buy Now
                  </a>
                ) : (
                  <button disabled className="w-full py-3 bg-white/5 text-muted-foreground font-display uppercase tracking-wider cursor-not-allowed">
                    Sold Out
                  </button>
                )}
              </NeonCard>
            ))}

            {/* Coming Soon Items */}
            {COMING_SOON_ITEMS.map((item) => (
              <NeonCard key={item.id} variant="primary" className="flex flex-col h-full group opacity-80 hover:opacity-100 transition-opacity">
                <div className="relative aspect-square mb-6 overflow-hidden bg-black/50 border border-white/5">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-primary text-black px-4 py-2 font-display text-xl uppercase tracking-tighter -rotate-12 border-2 border-black shadow-xl">
                      Coming Soon
                    </span>
                  </div>
                </div>
                
                <h3 className="text-2xl text-white font-display mb-2">{item.name}</h3>
                <p className="text-muted-foreground text-sm flex-grow mb-6 line-clamp-3">
                  {item.description}
                </p>
                
                <button disabled className="w-full py-3 bg-primary/20 text-primary border border-primary/50 font-display uppercase tracking-wider cursor-not-allowed">
                  Coming Soon
                </button>
              </NeonCard>
            ))}

            {(!items || items.length === 0) && COMING_SOON_ITEMS.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground font-mono">
                NO MERCH AVAILABLE YET. STAY TUNED.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CreateMerchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { mutate, isPending } = useCreateMerchandise();
  const { toast } = useToast();
  
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    mutate({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string,
      buyLink: formData.get("buyLink") as string,
      price: Math.round(parseFloat(formData.get("price") as string) * 100), // convert to cents
    }, {
      onSuccess: () => {
        toast({ title: "Success", description: "Merch item added!" });
        onOpenChange(false);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to create item", variant: "destructive" });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary border border-primary hover:bg-primary hover:text-white transition-all font-display text-sm uppercase">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </DialogTrigger>
      <DialogContent className="bg-background border-primary/20 text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-primary">Add New Merch</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Item Name</Label>
            <Input name="name" required placeholder="BuG Hoodie Limited" className="bg-black/50 border-white/10" />
          </div>
          <div className="space-y-2">
            <Label>Price ($)</Label>
            <Input name="price" type="number" step="0.01" required placeholder="49.99" className="bg-black/50 border-white/10" />
          </div>
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input name="imageUrl" type="url" required placeholder="https://..." className="bg-black/50 border-white/10" />
          </div>
          <div className="space-y-2">
            <Label>Buy Link</Label>
            <Input name="buyLink" type="url" placeholder="https://shopify..." className="bg-black/50 border-white/10" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea name="description" required placeholder="Product details..." className="bg-black/50 border-white/10" />
          </div>
          <button 
            disabled={isPending}
            className="w-full py-3 bg-primary text-white font-display uppercase hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            {isPending ? "Adding..." : "Create Item"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
