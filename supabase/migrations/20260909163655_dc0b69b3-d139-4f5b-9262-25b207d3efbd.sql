CREATE SCHEMA IF NOT EXISTS app_private;
ALTER FUNCTION public.has_role(UUID, public.app_role) SET SCHEMA app_private;
ALTER FUNCTION public.get_user_company(UUID) SET SCHEMA app_private;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC;
GRANT USAGE ON SCHEMA app_private TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.has_role(UUID, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.get_user_company(UUID) TO authenticated, service_role;