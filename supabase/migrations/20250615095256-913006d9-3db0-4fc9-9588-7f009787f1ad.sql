
-- 1. USERS/PROFILES TABLE
-- This table stores public user information and is linked to the private auth.users table.
CREATE TABLE
  public.users (
    id UUID NOT NULL PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'participant',
    profile_picture_url TEXT,
    bio TEXT,
    last_login_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    CONSTRAINT users_role_check CHECK ((role = ANY (ARRAY['participant'::text, 'host'::text, 'admin'::text])))
  );

COMMENT ON TABLE public.users IS 'Stores public user profile information.';

-- 2. CHALLENGES TABLE
-- Defines all the challenges created by hosts.
CREATE TABLE
  public.challenges (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid (),
    host_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    duration_days INTEGER NOT NULL DEFAULT 30,
    status TEXT NOT NULL DEFAULT 'draft',
    image_url TEXT,
    challenge_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    CONSTRAINT challenges_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'archived'::text, 'pending_review'::text])))
  );

COMMENT ON TABLE public.challenges IS 'Stores all challenge information.';

-- 3. DAILY_TASKS TABLE
-- Stores the specific daily tasks for each challenge.
CREATE TABLE
  public.daily_tasks (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid (),
    challenge_id UUID NOT NULL REFERENCES public.challenges (id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    resource_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

COMMENT ON TABLE public.daily_tasks IS 'Defines tasks for each day of a challenge.';

-- 4. CHALLENGE_METRICS TABLE
-- Defines the self-assessment metrics for each challenge.
CREATE TABLE
  public.challenge_metrics (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid (),
    challenge_id UUID NOT NULL REFERENCES public.challenges (id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_type TEXT NOT NULL,
    collection_frequency TEXT[],
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT challenge_metrics_metric_type_check CHECK ((metric_type = ANY (ARRAY['number_input'::text, 'slider_1_10'::text, 'text_area'::text])))
  );

COMMENT ON TABLE public.challenge_metrics IS 'Defines the custom metrics for self-assessment in a challenge.';

-- 5. USER_CHALLENGES TABLE (Participant's enrollment)
-- Tracks which users have joined which challenges.
CREATE TABLE
  public.user_challenges (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES public.challenges (id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_day INTEGER NOT NULL DEFAULT 1,
    challenge_status TEXT NOT NULL DEFAULT 'active',
    last_accessed_at TIMESTAMPTZ,
    UNIQUE (user_id, challenge_id),
    CONSTRAINT user_challenges_challenge_status_check CHECK ((challenge_status = ANY (ARRAY['active'::text, 'completed'::text, 'dropped'::text])))
  );

COMMENT ON TABLE public.user_challenges IS 'Tracks user enrollment and overall status in challenges.';

-- 6. USER_CHALLENGE_PROGRESS TABLE
-- Tracks the completion of daily tasks for each user in a challenge.
CREATE TABLE
  public.user_challenge_progress (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid (),
    user_challenge_id UUID NOT NULL REFERENCES public.user_challenges (id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES public.daily_tasks (id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    day_number INTEGER NOT NULL
  );

COMMENT ON TABLE public.user_challenge_progress IS 'Tracks daily task completion for a user in a challenge.';

-- 7. USER_METRIC_DATA TABLE
-- Stores the actual self-assessment data recorded by participants.
CREATE TABLE
  public.user_metric_data (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid (),
    user_challenge_id UUID NOT NULL REFERENCES public.user_challenges (id) ON DELETE CASCADE,
    metric_id UUID NOT NULL REFERENCES public.challenge_metrics (id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_type TEXT NOT NULL,
    value_text TEXT,
    value_number DOUBLE PRECISION,
    CONSTRAINT user_metric_data_data_type_check CHECK ((data_type = ANY (ARRAY['initial'::text, 'daily'::text, 'final'::text])))
  );

COMMENT ON TABLE public.user_metric_data IS 'Stores participant-recorded metric data.';

-- 8. APP_NOTIFICATIONS TABLE
-- For host-to-participant messages and system-wide notifications.
CREATE TABLE
  public.app_notifications (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID REFERENCES public.users (id) ON DELETE SET NULL,
    challenge_id UUID REFERENCES public.challenges (id) ON DELETE CASCADE,
    host_id UUID REFERENCES public.users (id) ON DELETE SET NULL,
    message_type TEXT NOT NULL DEFAULT 'system',
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    read_status BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT app_notifications_message_type_check CHECK ((message_type = ANY (ARRAY['announcement'::text, 'reminder'::text, 'system'::text])))
  );

COMMENT ON TABLE public.app_notifications IS 'Stores system and host-generated notifications for users.';
