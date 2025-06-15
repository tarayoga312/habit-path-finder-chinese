
-- Creates a function that inserts a new row into public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'participant');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Creates a trigger that fires after a new user is inserted into auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
