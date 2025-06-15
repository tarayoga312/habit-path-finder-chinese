
CREATE OR REPLACE FUNCTION public.create_full_challenge(
  p_name TEXT,
  p_description TEXT,
  p_duration_days INT,
  p_image_url TEXT,
  p_challenge_type TEXT,
  p_start_date DATE,
  p_tasks JSONB,
  p_metrics JSONB
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_challenge_id UUID;
  task_record JSONB;
  metric_record JSONB;
BEGIN
  -- 1. Insert the new challenge
  INSERT INTO public.challenges (host_id, name, description, duration_days, image_url, challenge_type, start_date, status)
  VALUES (auth.uid(), p_name, p_description, p_duration_days, p_image_url, p_challenge_type, p_start_date, 'pending_review')
  RETURNING id INTO new_challenge_id;

  -- 2. Insert the daily tasks
  IF p_tasks IS NOT NULL THEN
    FOR task_record IN SELECT * FROM jsonb_array_elements(p_tasks)
    LOOP
      INSERT INTO public.daily_tasks (challenge_id, day_number, title, description, video_url, resource_url)
      VALUES (
        new_challenge_id,
        (task_record->>'day_number')::INT,
        task_record->>'title',
        task_record->>'description',
        task_record->>'video_url',
        task_record->>'resource_url'
      );
    END LOOP;
  END IF;

  -- 3. Insert the challenge metrics
  IF p_metrics IS NOT NULL THEN
    FOR metric_record IN SELECT * FROM jsonb_array_elements(p_metrics)
    LOOP
      INSERT INTO public.challenge_metrics (challenge_id, metric_name, metric_type, collection_frequency, description)
      VALUES (
        new_challenge_id,
        metric_record->>'metric_name',
        metric_record->>'metric_type',
        (SELECT array_agg(value) FROM jsonb_array_elements_text(metric_record->'collection_frequency')),
        metric_record->>'description'
      );
    END LOOP;
  END IF;

  RETURN new_challenge_id;
END;
$$;
