
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles self read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "user_roles self read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admin manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email);
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
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
GRANT SELECT ON public.courses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
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
  question_en TEXT, question_fr TEXT, question_es TEXT, question_de TEXT,
  answer_en TEXT, answer_fr TEXT, answer_es TEXT, answer_de TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faq_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faq_items TO authenticated;
GRANT ALL ON public.faq_items TO service_role;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faq public read" ON public.faq_items FOR SELECT USING (true);
CREATE POLICY "admin manage faq" ON public.faq_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER faq_touch BEFORE UPDATE ON public.faq_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Contact info
CREATE TABLE public.contact_info (
  id TEXT PRIMARY KEY DEFAULT 'main',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_info TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_info TO authenticated;
GRANT ALL ON public.contact_info TO service_role;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_info public read" ON public.contact_info FOR SELECT USING (true);
CREATE POLICY "admin manage contact_info" ON public.contact_info FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER contact_info_touch BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Contact messages
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Seed data
INSERT INTO public.contact_info (id, phone, email, address) VALUES
('main', '0770 764 200' || E'\n' || '0770 767 750' || E'\n' || '0550 686 498', 'nooracademyalgeria@gmail.com', 'Hay Arroudj, Centre des Affaires Erriadh N°02 Chlef DZ، 02000');

INSERT INTO public.courses (id,title,description,price,duration,icon,category,is_featured,sort_order) VALUES
('bac','شعبة البكالوريا','دورات تحضيرية مكثفة لطلبة البكالوريا في جميع الشعب العلمية والأدبية مع نخبة من الأساتذة.','5000 دج / شهرياً','12 ساعة/أسبوع','GraduationCap','adults',true,1),
('english','اللغة الإنجليزية','دورات شاملة لتعلم اللغة الإنجليزية لجميع المستويات بإشراف أساتذة متخصصين ومناهج عالمية.','3500 دج / شهرياً','6 ساعات/أسبوع','Globe','adults',false,2),
('robotics','الروبوتيك للأطفال','دورات تفاعلية ممتعة في مجال الروبوتيك والبرمجة للأطفال من 8 إلى 14 سنة.','4500 دج / شهرياً','4 ساعات/أسبوع','Bot','kids',false,3);

INSERT INTO public.faq_items (question, answer, sort_order) VALUES
('هل يمكن تسجيل طفل في دروس محادثة ضمن مجموعة (وليس دروس فردية)؟', 'نعم، نوفر نشاط The Talk المخصص للأطفال، وهو برنامج تفاعلي لتطوير مهارات المحادثة ضمن مجموعات، ويُقام يوم السبت في أوقات تناسب دراستهم.', 1),
('هل يمكن الحصول على شهادة في الإعلام الآلي بدون اجتياز امتحان؟', 'نعم، في حال كان لديك مستوى جيد، يمكنك اجتياز تقييم مباشر مع الأستاذ. وإذا أثبتَّ تمكنك من المهارات المطلوبة، تتحصل على الشهادة.', 2),
('هل توفرون دراسة فردية؟ وكيف تكون؟', 'نعم، توجد إمكانية التسجيل في حصص فردية، مع اختيار توقيت يتناسب مع احتياجك وبرنامجك.', 3),
('هل تقدمون شهادات إثبات مستوى؟', 'نعم، بعد إتمام الدراسة نقدم شهادة تثبت مستواك في اللغة أو التخصص الذي درسته.', 4),
('هل هناك إمكانية الحصول على شهادة بدون دراسة؟', 'نعم، يتم إجراء امتحان كتابي وشفهي لتحديد مستواك، ثم تُمنح شهادة حسب المستوى الذي تحصلت عليه.', 5),
('كيف يمكنني التسجيل لتعلم الإنجليزية أو أي لغة أخرى؟', 'عند قدومك إلى أحد مقراتنا، يتم تقديم اختبار كتابي لتقييم مستواك، ثم توجيهك إلى الفوج والمستوى المناسب لك، لتبدأ الدراسة مباشرة.', 6),
('هل تتوفر لديكم نشاطات خاصة بالمحادثة فقط؟', 'نعم، لدينا نشاطات اجتماعية خاصة بالمؤسسة ترتكز على المحادثة والتواصل، ويتم تنظيمها بمواعيد مختلفة كل أسبوع.', 7),
('هل الشهادات التي تقدمونها يمكن العمل بها في الخارج؟', 'نعم، يعتمد ذلك على متطلبات الشركة أو المؤسسة التي ستعمل لديها. لدينا طلبة استخدموا شهاداتنا ضمن السيرة الذاتية في بلدان مختلفة كإثبات للمستوى.', 8),
('كيف تتم الدراسة للتحضير لاجتياز امتحان TCF؟', 'نقدم برامج تحضيرية متخصصة قبل اجتياز الامتحان، تشمل تدريبًا على مختلف أجزاء الاختبار وتقنيات الإجابة لرفع فرص النجاح.', 9);
