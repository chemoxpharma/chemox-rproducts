export type ProductCategory = "strong" | "campaign" | "rnd";

export type ComplianceType = "IP" | "BP" | "EP" | "USP" | "IH";

export interface Product {
  id: string;
  srNo: number;
  name: string;
  complianceList: ComplianceType[];
  therapeutic: string;
  casNo: string;
  category: ProductCategory;
  prices: Record<string, number | null>;
}

export const categoryLabels: Record<ProductCategory, string> = {
  strong: "Our Strong Products",
  campaign: "Our Campaign Products",
  rnd: "Our Research & Development Products",
};

export const categoryLetters: Record<ProductCategory, string> = {
  strong: "A",
  campaign: "B",
  rnd: "C",
};

function makeProduct(
  id: string, srNo: number, name: string, compliance: string,
  therapeutic: string, casNo: string, category: ProductCategory
): Product {
  const complianceList = compliance.split("/").map((s) => s.trim()) as ComplianceType[];
  const prices: Partial<Record<ComplianceType, number | null>> = {};
  complianceList.forEach((c) => (prices[c] = null));
  return { id, srNo, name, complianceList, therapeutic, casNo, category, prices };
}

export const initialProducts: Product[] = [
  makeProduct("s1", 1, "Atorvastatin Calcium", "IP/BP/USP", "Cardiovascular", "344423-98-9", "strong"),
  makeProduct("s2", 2, "Azithromycin", "IP/BP/EP/USP", "Anti-Bacterial Infection", "117772-70-0", "strong"),
  makeProduct("s3", 3, "Dorzolamide", "IP/BP/EP/USP", "Topical Beta Blockers", "130693-82-2", "strong"),
  makeProduct("s4", 4, "Fluconazole", "IP/BP/USP", "Anti-Fungal/Triazoles", "86386-73-4", "strong"),
  makeProduct("s5", 5, "Montelukast Sodium", "IP/EP/USP", "Anti-Asthmatic", "151767-02-1", "strong"),
  makeProduct("s6", 6, "Nitrofurantoin", "IP/EP/USP", "Antibiotic/Anti-Bacterial", "67-20-9", "strong"),
  makeProduct("s7", 7, "Rosuvastatin Calcium", "IP/BP/USP", "Cardiovascular", "147098-20-2", "strong"),
  makeProduct("s8", 8, "Tadalafil", "IP/BP/USP", "Erectile Dysfunction", "171596-29-5", "strong"),
  makeProduct("s9", 9, "Tigecycline", "IP/BP/USP", "Anti-Bacterial", "220620-09-7", "strong"),

  makeProduct("c1", 1, "Benfotiamine", "IH", "Diabetic Polyneuropathy", "22457-89-2", "campaign"),
  makeProduct("c2", 2, "Citicoline Sodium", "IH/IP/USP", "Nootropic, Psychostimulants", "33818-15-4", "campaign"),
  makeProduct("c3", 3, "Deferoxamine Mesylate", "IP/BP/USP", "Iron Chelating Agent", "138-14-7", "campaign"),
  makeProduct("c4", 4, "Fexofenadine HCl", "IP/BP/USP", "Anti-Histamines", "153439-40-8", "campaign"),
  makeProduct("c5", 5, "Mirabegron", "EP/IH", "Sympathomimetic", "223673-61-8", "campaign"),
  makeProduct("c6", 6, "Pantoprazole Sodium", "IP/BP/EP/USP", "Gastroesophageal Reflux Disease", "164579-32-2", "campaign"),

  makeProduct("r1", 1, "Brinzolamide", "IP/BP/USP", "Carbonic Anhydrase Inhibitor", "138890-62-7", "rnd"),
  makeProduct("r2", 2, "Luliconazole", "IP/BP/USP", "Anti-Fungal", "187164-19-8", "rnd"),
  makeProduct("r3", 3, "Pranlukast Sodium", "IP/BP/USP", "Anti-Asthmatic", "103177-37-3", "rnd"),
  makeProduct("r4", 4, "Rivaroxaban", "IP/BP/USP", "Anti Coagulant", "366789-02-8", "rnd"),
  makeProduct("r5", 5, "Vardenafil HCl", "IP/BP/USP", "Erectile Dysfunction", "330808-88-3", "rnd"),
];
