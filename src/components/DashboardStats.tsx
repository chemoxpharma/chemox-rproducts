import { Package, FlaskConical, Beaker, IndianRupee } from "lucide-react";
import { Product } from "@/data/products";

interface DashboardStatsProps {
  products: Product[];
}

export function DashboardStats({ products }: DashboardStatsProps) {
  const strong = products.filter((p) => p.category === "strong").length;
  const campaign = products.filter((p) => p.category === "campaign").length;
  const rnd = products.filter((p) => p.category === "rnd").length;
  const priced = products.filter((p) => Object.values(p.prices).some((v) => v !== null)).length;

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "text-primary" },
    { label: "Strong Products", value: strong, icon: FlaskConical, color: "text-category-strong" },
    { label: "Campaign Products", value: campaign, icon: Beaker, color: "text-category-campaign" },
    { label: "Priced Products", value: `${priced}/${products.length}`, icon: IndianRupee, color: "text-category-rnd" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-lg border p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
          </div>
        </div>
      ))}
    </div>
  );
}
