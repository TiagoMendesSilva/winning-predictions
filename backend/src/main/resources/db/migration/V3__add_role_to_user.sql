ALTER TABLE public.user
    ADD COLUMN role VARCHAR(30);

UPDATE public.user
SET role = 'ROLE_USER';

ALTER TABLE public.user
    ALTER COLUMN role SET NOT NULL;