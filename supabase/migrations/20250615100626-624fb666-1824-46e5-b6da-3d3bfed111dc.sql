
-- This script enables Row Level Security (RLS) for all tables
-- and creates policies to control data access.
-- It uses SECURITY DEFINER functions for better performance and security.

-- Helper function to safely get a user's role.
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = p_user_id;
$$;

-- Helper function to check if a user is the host of a challenge.
CREATE OR REPLACE FUNCTION public.is_challenge_host(p_challenge_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.challenges
    WHERE id = p_challenge_id AND host_id = p_user_id
  );
$$;

-- Helper function to check if a user is a participant in a user_challenge record.
CREATE OR REPLACE FUNCTION public.is_challenge_participant(p_user_challenge_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_challenges
    WHERE id = p_user_challenge_id AND user_id = p_user_id
  );
$$;

-- 1. Enable RLS for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_metric_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_notifications ENABLE ROW LEVEL SECURITY;

-- 2. POLICIES for 'users' table
-- Users can see their own profile.
CREATE POLICY "Allow individual read access" ON public.users FOR SELECT USING (auth.uid() = id);
-- Users can update their own profile.
CREATE POLICY "Allow individual update access" ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 3. POLICIES for 'challenges' table
-- Anyone who is authenticated can view active challenges.
CREATE POLICY "Allow read access for authenticated users" ON public.challenges FOR SELECT USING (auth.role() = 'authenticated');
-- Hosts can create challenges.
CREATE POLICY "Allow hosts to create challenges" ON public.challenges FOR INSERT WITH CHECK (auth.uid() = host_id AND public.get_user_role(auth.uid()) = 'host');
-- Hosts can update their own challenges.
CREATE POLICY "Allow hosts to update their own challenges" ON public.challenges FOR UPDATE USING (auth.uid() = host_id AND public.get_user_role(auth.uid()) = 'host') WITH CHECK (auth.uid() = host_id);

-- 4. POLICIES for 'daily_tasks' and 'challenge_metrics'
-- Anyone authenticated can view tasks and metrics for challenges.
CREATE POLICY "Allow read access for authenticated users" ON public.daily_tasks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON public.challenge_metrics FOR SELECT USING (auth.role() = 'authenticated');
-- Hosts can manage tasks and metrics for their own challenges
CREATE POLICY "Allow hosts to manage tasks" ON public.daily_tasks FOR ALL USING (public.get_user_role(auth.uid()) = 'host' AND public.is_challenge_host(challenge_id, auth.uid()));
CREATE POLICY "Allow hosts to manage metrics" ON public.challenge_metrics FOR ALL USING (public.get_user_role(auth.uid()) = 'host' AND public.is_challenge_host(challenge_id, auth.uid()));

-- 5. POLICIES for 'user_challenges' (Enrollments)
-- Users can see their own enrollments.
CREATE POLICY "Allow individual read access" ON public.user_challenges FOR SELECT USING (auth.uid() = user_id);
-- Users can enroll themselves in a challenge.
CREATE POLICY "Allow individual insert access" ON public.user_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Users can update their own enrollment status (e.g., drop challenge).
CREATE POLICY "Allow individual update access" ON public.user_challenges FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. POLICIES for 'user_challenge_progress' and 'user_metric_data'
-- Users can only view their own progress and metric data.
CREATE POLICY "Allow individual read access" ON public.user_challenge_progress FOR SELECT USING (public.is_challenge_participant(user_challenge_id, auth.uid()));
CREATE POLICY "Allow individual read access" ON public.user_metric_data FOR SELECT USING (public.is_challenge_participant(user_challenge_id, auth.uid()));

-- Users can only insert progress and metric data for their own enrollments.
CREATE POLICY "Allow individual insert access" ON public.user_challenge_progress FOR INSERT WITH CHECK (public.is_challenge_participant(user_challenge_id, auth.uid()));
CREATE POLICY "Allow individual insert access" ON public.user_metric_data FOR INSERT WITH CHECK (public.is_challenge_participant(user_challenge_id, auth.uid()));

-- 7. POLICIES for 'app_notifications'
-- Users can only see notifications meant for them.
CREATE POLICY "Allow individual read access" ON public.app_notifications FOR SELECT USING (auth.uid() = user_id);

