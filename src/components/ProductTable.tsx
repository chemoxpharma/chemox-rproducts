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
  onUpdatePrice: (id: string, compliance: ComplianceType, price: number | null) => void;
  isAdmin: boolean;
}

const categoryBadgeMap: Record<ProductCategory, string> = {
  strong: "bg-category-strong text-primary-foreground",
  campaign: "bg-category-campaign text-primary-foreground",
  rnd: "bg-category-rnd text-primary-foreground",
};

const complianceBadgeColors: Record<ComplianceType, string> = {
  IP: "bg-blue-100 text-blue-800 border-blue-200",
  BP: "bg-emerald-100 text-emerald-800 border-emerald-200",
  EP: "bg-violet-100 text-violet-800 border-violet-200",
  USP: "bg-orange-100 text-orange-800 border-orange-200",
  IH: "bg-rose-100 text-rose-800 border-rose-200",
};

export function ProductTable({ products, category, onUpdatePrice, isAdmin }: ProductTableProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const filtered = products.filter((p) => p.category === category);

  const startEdit = (productId: string, comp: ComplianceType, currentPrice: number | null) => {
    if (!isAdmin) return;
    setEditingKey(`${productId}-${comp}`);
    setEditValue(currentPrice !== null ? String(currentPrice) : "");
  };

  const saveEdit = (productId: string, comp: ComplianceType) => {
    if (!isAdmin) return;
    const val = editValue.trim();
    onUpdatePrice(productId, comp, val === "" ? null : parseFloat(val));
    setEditingKey(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue("");
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
              <TableHead className="w-12 text-center font-semibold">#</TableHead>
              <TableHead className="font-semibold">Product Name</TableHead>
              <TableHead className="font-semibold">Therapeutic Use</TableHead>
              <TableHead className="font-semibold font-mono">CAS No.</TableHead>
              <TableHead className="font-semibold">Pricing by Compliance (₹/kg)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product.id} className="group hover:bg-accent/30 transition-colors">
                <TableCell className="text-center text-muted-foreground font-mono text-sm">
                  {product.srNo}
                </TableCell>
                <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{product.therapeutic}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{product.casNo}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {product.complianceList.map((comp) => {
                      const key = `${product.id}-${comp}`;
                      const price = product.prices[comp] ?? null;
                      const isEditing = editingKey === key;

                      return (
                        <div
                          key={key}
                          className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs ${complianceBadgeColors[comp]}`}
                        >
                          <span className="font-semibold min-w-[28px]">{comp}</span>
                          {isEditing ? (
                            <div className="flex items-center gap-0.5">
                              <Input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveEdit(product.id, comp);
                                  if (e.key === "Escape") cancelEdit();
                                }}
                                className="w-20 h-5 text-xs text-right font-mono px-1 bg-card border-none"
                                placeholder="Price"
                                autoFocus
                              />
                              <button onClick={() => saveEdit(product.id, comp)} className="p-0.5 hover:opacity-70">
                                <Check className="h-3 w-3" />
                              </button>
                              <button onClick={cancelEdit} className="p-0.5 hover:opacity-70">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div 
                              className={`flex items-center gap-1 ${isAdmin ? 'cursor-pointer' : ''}`} 
                              onClick={() => isAdmin && startEdit(product.id, comp, price)}
                            >
                              <span className="font-mono">
                                {price !== null ? `₹${price.toLocaleString("en-IN")}` : "—"}
                              </span>
                              {isAdmin && <Pencil className="h-2.5 w-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
