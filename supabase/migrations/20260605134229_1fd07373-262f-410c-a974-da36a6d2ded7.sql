-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('root', 'admin', 'user1');
CREATE TYPE public.attendance_status AS ENUM ('P', 'A', 'Partial', 'L', 'PH', 'WO');

-- ============ COMPANIES ============
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============ has_role (security definer, prevents RLS recursion) ============
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.get_user_company(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE id = _user_id
$$;

-- ============ EMPLOYEES ============
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_code TEXT NOT NULL,
  full_name TEXT NOT NULL,
  contractor TEXT,
  plant TEXT,
  department TEXT,
  supervisor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (company_id, employee_code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- ============ ATTENDANCE RECORDS ============
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  status public.attendance_status NOT NULL DEFAULT 'A',
  punch_in_1 TIMESTAMPTZ,
  punch_out_1 TIMESTAMPTZ,
  punch_in_2 TIMESTAMPTZ,
  punch_out_2 TIMESTAMPTZ,
  punch_in_3 TIMESTAMPTZ,
  punch_out_3 TIMESTAMPTZ,
  total_hours NUMERIC(5,2) DEFAULT 0,
  overtime_hours NUMERIC(5,2) DEFAULT 0,
  mandays NUMERIC(3,2) DEFAULT 0,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (employee_id, attendance_date)
);
CREATE INDEX idx_attendance_company_date ON public.attendance_records(company_id, attendance_date);
CREATE INDEX idx_attendance_employee_date ON public.attendance_records(employee_id, attendance_date);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance_records TO authenticated;
GRANT ALL ON public.attendance_records TO service_role;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- ============ AUDIT TRAIL ============
CREATE TABLE public.audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_company_created ON public.audit_trail(company_id, created_at DESC);
GRANT SELECT, INSERT ON public.audit_trail TO authenticated;
GRANT ALL ON public.audit_trail TO service_role;
ALTER TABLE public.audit_trail ENABLE ROW LEVEL SECURITY;

-- ============ updated_at trigger ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_companies_updated BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_employees_updated BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_attendance_updated BEFORE UPDATE ON public.attendance_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ Auto-create profile + default role on signup ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user1');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ RLS POLICIES ============

-- companies
CREATE POLICY "Root sees all companies" ON public.companies FOR SELECT
  USING (public.has_role(auth.uid(), 'root'));
CREATE POLICY "Users see their own company" ON public.companies FOR SELECT
  USING (id = public.get_user_company(auth.uid()));
CREATE POLICY "Root manages companies" ON public.companies FOR ALL
  USING (public.has_role(auth.uid(), 'root'))
  WITH CHECK (public.has_role(auth.uid(), 'root'));

-- profiles
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Root views all profiles" ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'root'));
CREATE POLICY "Admin views company profiles" ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') AND company_id = public.get_user_company(auth.uid()));
CREATE POLICY "Root manages all profiles" ON public.profiles FOR ALL
  USING (public.has_role(auth.uid(), 'root'))
  WITH CHECK (public.has_role(auth.uid(), 'root'));
CREATE POLICY "Profile insert on signup" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- user_roles
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Root views all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'root'));
CREATE POLICY "Root manages roles" ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'root'))
  WITH CHECK (public.has_role(auth.uid(), 'root'));

-- employees
CREATE POLICY "Root sees all employees" ON public.employees FOR SELECT
  USING (public.has_role(auth.uid(), 'root'));
CREATE POLICY "Admin sees company employees" ON public.employees FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') AND company_id = public.get_user_company(auth.uid()));
CREATE POLICY "Supervisor sees own employees" ON public.employees FOR SELECT
  USING (public.has_role(auth.uid(), 'user1') AND supervisor_id = auth.uid());
CREATE POLICY "Root manages employees" ON public.employees FOR ALL
  USING (public.has_role(auth.uid(), 'root'))
  WITH CHECK (public.has_role(auth.uid(), 'root'));
CREATE POLICY "Admin manages company employees" ON public.employees FOR ALL
  USING (public.has_role(auth.uid(), 'admin') AND company_id = public.get_user_company(auth.uid()))
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND company_id = public.get_user_company(auth.uid()));

-- attendance_records
CREATE POLICY "Root sees all attendance" ON public.attendance_records FOR SELECT
  USING (public.has_role(auth.uid(), 'root'));
CREATE POLICY "Admin sees company attendance" ON public.attendance_records FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') AND company_id = public.get_user_company(auth.uid()));
CREATE POLICY "Supervisor sees assigned attendance" ON public.attendance_records FOR SELECT
  USING (public.has_role(auth.uid(), 'user1') AND employee_id IN (
    SELECT id FROM public.employees WHERE supervisor_id = auth.uid()
  ));
CREATE POLICY "Root manages attendance" ON public.attendance_records FOR ALL
  USING (public.has_role(auth.uid(), 'root'))
  WITH CHECK (public.has_role(auth.uid(), 'root'));
CREATE POLICY "Admin manages company attendance" ON public.attendance_records FOR ALL
  USING (public.has_role(auth.uid(), 'admin') AND company_id = public.get_user_company(auth.uid()))
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND company_id = public.get_user_company(auth.uid()));
CREATE POLICY "Supervisor inserts assigned attendance" ON public.attendance_records FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'user1') AND employee_id IN (
    SELECT id FROM public.employees WHERE supervisor_id = auth.uid()
  ));
CREATE POLICY "Supervisor updates assigned attendance" ON public.attendance_records FOR UPDATE
  USING (public.has_role(auth.uid(), 'user1') AND employee_id IN (
    SELECT id FROM public.employees WHERE supervisor_id = auth.uid()
  ));

-- audit_trail
CREATE POLICY "Root views all audit" ON public.audit_trail FOR SELECT
  USING (public.has_role(auth.uid(), 'root'));
CREATE POLICY "Admin views company audit" ON public.audit_trail FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') AND company_id = public.get_user_company(auth.uid()));
CREATE POLICY "Authenticated inserts audit" ON public.audit_trail FOR INSERT
  WITH CHECK (auth.uid() = user_id);