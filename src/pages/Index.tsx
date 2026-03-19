import { useState } from "react";
import { Search, LogOut, Loader2 } from "lucide-react";
import { Product, ProductCategory, ComplianceType } from "@/data/products";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/ProductTable";
import { DashboardStats } from "@/components/DashboardStats";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const categories: ProductCategory[] = ["strong", "campaign", "rnd"];

const Index = () => {
  const { signOut, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sr_no", { ascending: true });
      
      if (error) throw error;
      
      return data.map((row: any) => ({
        id: row.id,
        srNo: row.sr_no,
        name: row.name,
        complianceList: row.compliance_list,
        therapeutic: row.therapeutic,
        casNo: row.cas_no,
        category: row.category as ProductCategory,
        prices: row.prices || {},
      })) as Product[];
    },
  });

  const updatePriceMutation = useMutation({
    mutationFn: async ({ id, prices }: { id: string; prices: any }) => {
      const { error } = await supabase
        .from("products")
        .update({ prices })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });

  const handleUpdatePrice = (id: string, compliance: ComplianceType, price: number | null) => {
    if (!isAdmin) {
      toast.error("Only admins can update prices");
      return;
    }

    const product = products.find((p) => p.id === id);
    if (!product) return;

    const newPrices = { ...product.prices, [compliance]: price };
    
    updatePriceMutation.mutate({ id, prices: newPrices });
    
    toast.success(`${compliance} price updated for ${product.name}`, {
      description: price !== null ? `₹${price.toLocaleString("en-IN")}/kg` : "Price cleared",
    });
  };

  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.therapeutic.toLowerCase().includes(search.toLowerCase()) ||
          p.casNo.includes(search)
      )
    : products;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground leading-tight">ChemoxPharma</h1>
                <p className="text-xs text-muted-foreground">{isAdmin ? "Admin Dashboard" : "Product Catalog"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, CAS No..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 bg-secondary/50"
                />
              </div>
              <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground">
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Product Catalog</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Active Pharmaceutical Ingredients & Intermediates {isAdmin && "— click any compliance price to edit"}
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Loading products...</p>
          </div>
        ) : (
          <>
            <DashboardStats products={filtered} />

            {categories.map((cat) => {
              const catProducts = filtered.filter((p) => p.category === cat);
              if (catProducts.length === 0) return null;
              return (
                <ProductTable
                  key={cat}
                  products={filtered}
                  category={cat}
                  onUpdatePrice={handleUpdatePrice}
                  isAdmin={isAdmin}
                />
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No products found matching "{search}"</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;

