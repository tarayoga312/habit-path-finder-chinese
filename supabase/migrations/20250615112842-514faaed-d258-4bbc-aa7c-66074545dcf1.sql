
CREATE OR REPLACE FUNCTION public.join_challenge_with_initial_data(
  p_challenge_id UUID,
  p_user_id UUID,
  p_initial_metrics JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_challenge_id UUID;
  metric_record JSONB;
BEGIN
  -- 1. Insert into user_challenges to create the enrollment record
  INSERT INTO public.user_challenges (user_id, challenge_id)
  VALUES (p_user_id, p_challenge_id)
  RETURNING id INTO new_user_challenge_id;

  -- 2. Loop through the JSON array of metrics and insert them
  FOR metric_record IN SELECT * FROM jsonb_array_elements(p_initial_metrics)
  LOOP
    INSERT INTO public.user_metric_data (user_challenge_id, metric_id, data_type, value_text, value_number)
    VALUES (
      new_user_challenge_id,
      (metric_record->>'metric_id')::UUID,
      'initial',
      metric_record->>'value_text',
      (metric_record->>'value_number')::double precision
    );
  END LOOP;

  -- 3. Return the ID of the new user_challenges record
  RETURN new_user_challenge_id;
END;
$$;
