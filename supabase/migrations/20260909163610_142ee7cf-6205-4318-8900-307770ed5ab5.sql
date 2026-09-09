ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS user_id UUID UNIQUE;
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON public.employees(user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
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
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user2');
  RETURN NEW;
END;
$$;

CREATE POLICY "User2 sees linked employee" ON public.employees
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'user2') AND user_id = auth.uid());

CREATE POLICY "User2 sees own attendance" ON public.attendance_records
FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'user2')
  AND employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);