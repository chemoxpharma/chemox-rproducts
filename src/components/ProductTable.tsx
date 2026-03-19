import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { Product, ProductCategory, ComplianceType, categoryLabels, categoryLetters } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductTableProps {
  products: Product[];
  category: ProductCategory;
  onUpdatePrice: (id: string, priceKey: string, price: number | null) => void;
  isAdmin: boolean;
  pdcPercentage: number;
  onPdcPercentageChange: (value: number) => void;
}

const categoryBadgeMap: Record<ProductCategory, string> = {
  strong: "bg-category-strong text-primary-foreground",
  campaign: "bg-category-campaign text-primary-foreground",
  rnd: "bg-category-rnd text-primary-foreground",
};

const complianceBadgeColors: Record<string, string> = {
  IP: "bg-blue-100 text-blue-800 border-blue-200",
  BP: "bg-emerald-100 text-emerald-800 border-emerald-200",
  EP: "bg-violet-100 text-violet-800 border-violet-200",
  USP: "bg-orange-100 text-orange-800 border-orange-200",
  IH: "bg-rose-100 text-rose-800 border-rose-200",
  advance: "bg-indigo-100 text-indigo-800 border-indigo-200",
  pdc: "bg-amber-100 text-amber-800 border-amber-200",
};

export function ProductTable({ 
  products, 
  category, 
  onUpdatePrice, 
  isAdmin, 
  pdcPercentage, 
  onPdcPercentageChange 
}: ProductTableProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const filtered = products.filter((p) => p.category === category);

  const startEdit = (productId: string, priceKey: string, currentPrice: number | null) => {
    if (!isAdmin) return;
    setEditingKey(`${productId}-${priceKey}`);
    setEditValue(currentPrice !== null ? String(currentPrice) : "");
  };

  const saveEdit = (productId: string, priceKey: string) => {
    if (!isAdmin) return;
    const val = editValue.trim();
    onUpdatePrice(productId, priceKey, val === "" ? null : parseFloat(val));
    setEditingKey(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue("");
  };

  const renderPriceBadge = (product: Product, priceKey: string, label?: string) => {
    const key = `${product.id}-${priceKey}`;
    let price = (product.prices[priceKey] ?? null) as number | null;
    let isAutoValue = false;

    // Auto-calculate PDC if missing but IP exists
    if (priceKey === "pdc" && price === null) {
      // Look for IP regardless of case
      const ipKey = Object.keys(product.prices).find(k => k.toUpperCase() === "IP");
      const ipPrice = ipKey ? (product.prices[ipKey] as number | null) : null;
      if (ipPrice !== null) {
        price = Math.round(ipPrice * (1 + pdcPercentage / 100));
        isAutoValue = true;
      }
    }

    const isEditing = editingKey === key;
    const badgeColor = complianceBadgeColors[priceKey] || "bg-gray-100 text-gray-800 border-gray-200";

    return (
      <div
        key={key}
        className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm ${badgeColor} ${isAutoValue ? 'border-dashed opacity-80' : ''}`}
      >
        <span className="font-semibold min-w-[32px]">{label || priceKey}</span>
        {isEditing ? (
          <div className="flex items-center gap-1">
            <Input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit(product.id, priceKey);
                if (e.key === "Escape") cancelEdit();
              }}
              className="w-24 h-6 text-sm text-right font-mono px-1 bg-card border-none"
              placeholder="Price"
              autoFocus
            />
            <button onClick={() => saveEdit(product.id, priceKey)} className="p-0.5 hover:opacity-70">
              <Check className="h-4 w-4" />
            </button>
            <button onClick={cancelEdit} className="p-0.5 hover:opacity-70">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div 
            className={`flex items-center gap-1.5 ${isAdmin ? 'cursor-pointer' : ''}`} 
            onClick={() => isAdmin && startEdit(product.id, priceKey, price)}
          >
            <span className={`font-mono ${isAutoValue ? 'italic' : ''}`}>
              {price !== null ? `₹${price.toLocaleString("en-IN")}` : "—"}
            </span>
            {isAdmin && <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Badge className={categoryBadgeMap[category] + " text-sm px-3 py-1 font-semibold"}>
          {categoryLetters[category]}
        </Badge>
        <h2 className="text-lg font-semibold text-foreground">{categoryLabels[category]}</h2>
        <span className="text-sm text-muted-foreground">({filtered.length} products)</span>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-14 text-center font-bold text-foreground">#</TableHead>
              <TableHead className="font-bold text-foreground text-base">Product Name</TableHead>
              <TableHead className="font-bold text-foreground text-base">Therapeutic Use</TableHead>
              <TableHead className="font-bold text-foreground text-base font-mono">CAS No.</TableHead>
              <TableHead className="font-bold text-foreground text-base">Compliance Pricing (₹/kg)</TableHead>
              <TableHead className="font-bold text-foreground text-base">Advance Price (₹/kg)</TableHead>
              <TableHead className="font-bold text-foreground text-base">
                <div className="flex flex-col gap-1">
                  <span className="whitespace-nowrap">PDC Price (90 Days)</span>
                  {isAdmin && (
                    <div className="flex items-center gap-1 mt-1">
                      <Input
                        type="number"
                        value={pdcPercentage}
                        onChange={(e) => onPdcPercentageChange(parseFloat(e.target.value) || 0)}
                        className="w-20 h-7 text-xs px-2 bg-card"
                        step="0.5"
                      />
                      <span className="text-xs text-muted-foreground font-normal">% add</span>
                    </div>
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product.id} className="group hover:bg-accent/30 transition-colors">
                <TableCell className="text-center text-muted-foreground font-mono text-base">
                  {product.srNo}
                </TableCell>
                <TableCell className="font-bold text-foreground text-lg">{product.name}</TableCell>
                <TableCell className="text-muted-foreground text-base">{product.therapeutic}</TableCell>
                <TableCell className="font-mono text-base text-muted-foreground">{product.casNo}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {product.complianceList.map((comp) => renderPriceBadge(product, comp))}
                  </div>
                </TableCell>
                <TableCell>
                  {renderPriceBadge(product, "advance", "ADV")}
                </TableCell>
                <TableCell>
                  {renderPriceBadge(product, "pdc", "PDC")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
