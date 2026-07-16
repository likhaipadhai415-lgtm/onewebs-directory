CREATE POLICY "Users can view their own submissions"
ON public.submissions
FOR SELECT
TO authenticated
USING (lower(submitter_email) = lower((auth.jwt() ->> 'email')));