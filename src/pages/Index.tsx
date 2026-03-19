import { useState } from "react";
import { Search, LogOut } from "lucide-react";
import { Product, ProductCategory, ComplianceType, initialProducts } from "@/data/products";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/ProductTable";
import { DashboardStats } from "@/components/DashboardStats";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const categories: ProductCategory[] = ["strong", "campaign", "rnd"];

const Index = () => {
  const { signOut, user } = useAuth();
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("chemox-products-v2");
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const [search, setSearch] = useState("");

  const handleUpdatePrice = (id: string, compliance: ComplianceType, price: number | null) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, prices: { ...p.prices, [compliance]: price } } : p
    );
    setProducts(updated);
    localStorage.setItem("chemox-products-v2", JSON.stringify(updated));
    const product = products.find((p) => p.id === id);
    toast.success(`${compliance} price updated for ${product?.name}`, {
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
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
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
            Active Pharmaceutical Ingredients & Intermediates — click any compliance price to edit
          </p>
        </div>

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
            />
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No products found matching "{search}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
