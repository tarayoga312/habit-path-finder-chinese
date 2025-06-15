
-- Add a 'featured' column to the challenges table to distinguish featured challenges.
ALTER TABLE public.challenges ADD COLUMN featured BOOLEAN NOT NULL DEFAULT FALSE;

-- Create a function to securely fetch public challenge data for the homepage.
-- This function is a SECURITY DEFINER, so it can bypass RLS to join tables
-- and only expose the necessary public information, which is a secure way to handle public data.
CREATE OR REPLACE FUNCTION public.get_public_challenges()
RETURNS TABLE (
    id uuid,
    name text,
    description text,
    image_url text,
    challenge_type text,
    host_name text,
    participant_count bigint,
    duration_days integer,
    start_date date,
    featured boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT
      c.id,
      c.name,
      c.description,
      c.image_url,
      c.challenge_type,
      u.name,
      (SELECT COUNT(*) FROM public.user_challenges uc WHERE uc.challenge_id = c.id) as participant_count,
      c.duration_days,
      c.start_date,
      c.featured
    FROM
      public.challenges c
      LEFT JOIN public.users u ON c.host_id = u.id
    WHERE
      c.status = 'active';
END;
$$;
