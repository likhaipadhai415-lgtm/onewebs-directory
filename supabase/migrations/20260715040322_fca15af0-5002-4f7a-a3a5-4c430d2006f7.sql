
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.submission_status AS ENUM ('pending', 'approved', 'declined');

-- User roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Security definer role check
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-grant admin to verified likhaipadhai415@gmail.com
CREATE OR REPLACE FUNCTION public.grant_admin_for_verified_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND lower(NEW.email) = 'likhaipadhai415@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_admin_for_verified_email();

CREATE TRIGGER on_auth_user_confirmed_grant_admin
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.grant_admin_for_verified_email();

-- Submissions table
CREATE TABLE public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  pricing text NOT NULL,
  logo_url text NOT NULL,
  submitter_email text NOT NULL,
  relation text,
  status public.submission_status NOT NULL DEFAULT 'pending',
  popular boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id)
);

GRANT SELECT ON public.submissions TO anon;
GRANT SELECT, INSERT ON public.submissions TO authenticated;
GRANT ALL ON public.submissions TO service_role;

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit
CREATE POLICY "Anyone can insert submissions"
  ON public.submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Anyone can read approved submissions
CREATE POLICY "Approved submissions are public"
  ON public.submissions FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Admins can read all
CREATE POLICY "Admins can view all submissions"
  ON public.submissions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update
CREATE POLICY "Admins can update submissions"
  ON public.submissions FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete
CREATE POLICY "Admins can delete submissions"
  ON public.submissions FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX submissions_status_idx ON public.submissions (status, created_at DESC);
CREATE INDEX submissions_category_idx ON public.submissions (category);
