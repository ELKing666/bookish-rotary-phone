ALTER TABLE public.faq_items
  ADD COLUMN IF NOT EXISTS question_en text,
  ADD COLUMN IF NOT EXISTS question_fr text,
  ADD COLUMN IF NOT EXISTS question_es text,
  ADD COLUMN IF NOT EXISTS question_de text,
  ADD COLUMN IF NOT EXISTS answer_en text,
  ADD COLUMN IF NOT EXISTS answer_fr text,
  ADD COLUMN IF NOT EXISTS answer_es text,
  ADD COLUMN IF NOT EXISTS answer_de text;