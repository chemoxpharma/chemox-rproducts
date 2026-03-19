-- Seed initial products from products.ts
INSERT INTO public.products (id, sr_no, name, compliance_list, therapeutic, cas_no, category, prices)
VALUES
('s1', 1, 'Atorvastatin Calcium', ARRAY['IP', 'BP', 'USP'], 'Cardiovascular', '344423-98-9', 'strong', '{}'::jsonb),
('s2', 2, 'Azithromycin', ARRAY['IP', 'BP', 'EP', 'USP'], 'Anti-Bacterial Infection', '117772-70-0', 'strong', '{}'::jsonb),
('s3', 3, 'Dorzolamide', ARRAY['IP', 'BP', 'EP', 'USP'], 'Topical Beta Blockers', '130693-82-2', 'strong', '{}'::jsonb),
('s4', 4, 'Fluconazole', ARRAY['IP', 'BP', 'USP'], 'Anti-Fungal/Triazoles', '86386-73-4', 'strong', '{}'::jsonb),
('s5', 5, 'Montelukast Sodium', ARRAY['IP', 'EP', 'USP'], 'Anti-Asthmatic', '151767-02-1', 'strong', '{}'::jsonb),
('s6', 6, 'Nitrofurantoin', ARRAY['IP', 'EP', 'USP'], 'Antibiotic/Anti-Bacterial', '67-20-9', 'strong', '{}'::jsonb),
('s7', 7, 'Rosuvastatin Calcium', ARRAY['IP', 'BP', 'USP'], 'Cardiovascular', '147098-20-2', 'strong', '{}'::jsonb),
('s8', 8, 'Tadalafil', ARRAY['IP', 'BP', 'USP'], 'Erectile Dysfunction', '171596-29-5', 'strong', '{}'::jsonb),
('s9', 9, 'Tigecycline', ARRAY['IP', 'BP', 'USP'], 'Anti-Bacterial', '220620-09-7', 'strong', '{}'::jsonb),
('c1', 1, 'Benfotiamine', ARRAY['IH'], 'Diabetic Polyneuropathy', '22457-89-2', 'campaign', '{}'::jsonb),
('c2', 2, 'Citicoline Sodium', ARRAY['IH', 'IP', 'USP'], 'Nootropic, Psychostimulants', '33818-15-4', 'campaign', '{}'::jsonb),
('c3', 3, 'Deferoxamine Mesylate', ARRAY['IP', 'BP', 'USP'], 'Iron Chelating Agent', '138-14-7', 'campaign', '{}'::jsonb),
('c4', 4, 'Fexofenadine HCl', ARRAY['IP', 'BP', 'USP'], 'Anti-Histamines', '153439-40-8', 'campaign', '{}'::jsonb),
('c5', 5, 'Mirabegron', ARRAY['EP', 'IH'], 'Sympathomimetic', '223673-61-8', 'campaign', '{}'::jsonb),
('c6', 6, 'Pantoprazole Sodium', ARRAY['IP', 'BP', 'EP', 'USP'], 'Gastroesophageal Reflux Disease', '164579-32-2', 'campaign', '{}'::jsonb),
('r1', 1, 'Brinzolamide', ARRAY['IP', 'BP', 'USP'], 'Carbonic Anhydrase Inhibitor', '138890-62-7', 'rnd', '{}'::jsonb),
('r2', 2, 'Luliconazole', ARRAY['IP', 'BP', 'USP'], 'Anti-Fungal', '187164-19-8', 'rnd', '{}'::jsonb),
('r3', 3, 'Pranlukast Sodium', ARRAY['IP', 'BP', 'USP'], 'Anti-Asthmatic', '103177-37-3', 'rnd', '{}'::jsonb),
('r4', 4, 'Rivaroxaban', ARRAY['IP', 'BP', 'USP'], 'Anti Coagulant', '366789-02-8', 'rnd', '{}'::jsonb),
('r5', 5, 'Vardenafil HCl', ARRAY['IP', 'BP', 'USP'], 'Erectile Dysfunction', '330808-88-3', 'rnd', '{}'::jsonb);
