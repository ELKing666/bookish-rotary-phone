
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles self read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "user_roles self read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admin manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email);
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Courses
CREATE TABLE public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'BookOpen',
  category TEXT NOT NULL DEFAULT 'adults',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  badge TEXT DEFAULT '',
  stats JSONB,
  topics JSONB,
  for_whom JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses public read" ON public.courses FOR SELECT USING (true);
CREATE POLICY "admin manage courses" ON public.courses FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER courses_touch BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- FAQ
CREATE TABLE public.faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faq public read" ON public.faq_items FOR SELECT USING (true);
CREATE POLICY "admin manage faq" ON public.faq_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER faq_touch BEFORE UPDATE ON public.faq_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Contact info (single row)
CREATE TABLE public.contact_info (
  id TEXT PRIMARY KEY DEFAULT 'main',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_info public read" ON public.contact_info FOR SELECT USING (true);
CREATE POLICY "admin manage contact_info" ON public.contact_info FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER contact_info_touch BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Contact messages (form submissions)
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Seed contact info
INSERT INTO public.contact_info (id, phone, email, address) VALUES
('main', '0770 764 200' || E'\n' || '0770 767 750' || E'\n' || '0550 686 498', 'nooracademyalgeria@gmail.com', 'Hay Arroudj, Centre des Affaires Erriadh N°02 Chlef DZ، 02000');

-- Seed courses
INSERT INTO public.courses (id,title,description,price,duration,icon,category,is_featured,sort_order) VALUES
('bac','شعبة البكالوريا','دورات تحضيرية مكثفة لطلبة البكالوريا في جميع الشعب العلمية والأدبية مع نخبة من الأساتذة.','5000 دج / شهرياً','12 ساعة/أسبوع','GraduationCap','adults',true,1),
('english','اللغة الإنجليزية','دورات شاملة لتعلم اللغة الإنجليزية لجميع المستويات بإشراف أساتذة متخصصين ومناهج عالمية.','3500 دج / شهرياً','6 ساعات/أسبوع','Globe','adults',false,2),
('robotics','الروبوتيك للأطفال','دورات تفاعلية ممتعة في مجال الروبوتيك والبرمجة للأطفال من 8 إلى 14 سنة.','4500 دج / شهرياً','4 ساعات/أسبوع','Bot','kids',false,3);

-- Seed FAQ
INSERT INTO public.faq_items (question, answer, sort_order) VALUES
('ما هي طرق التسجيل في الدورات؟', 'يمكنكم التسجيل عبر تعبئة نموذج التواصل أو زيارة أحد فروعنا أو الاتصال بنا مباشرة على الأرقام المتوفرة.', 1),
('هل توفر الأكاديمية متابعة فردية للطلاب؟', 'نعم، نوفر متابعة بيداغوجية دقيقة وفردية لكل طالب لضمان التقدم المستمر وتحقيق أفضل النتائج.', 2),
('ما هي الفئات العمرية المستهدفة؟', 'نقدم دورات لجميع الفئات العمرية من الأطفال (8 سنوات) إلى الكبار، مع برامج مخصصة لكل فئة.', 3),
('هل يمكن تجربة درس قبل التسجيل النهائي؟', 'نعم، نوفر إمكانية حضور درس تجريبي مجاني للتعرف على بيئة التعليم وأسلوب الأساتذة قبل التسجيل.', 4),
('هل تُمنح شهادات في نهاية الدورات؟', 'نعم، نمنح شهادات معتمدة في نهاية كل دورة تدريبية لتثبت إكمال البرنامج بنجاح.', 5);
