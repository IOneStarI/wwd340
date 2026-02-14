CREATE TABLE IF NOT EXISTS public.saved_vehicle (
  saved_id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES public.account(account_id) ON DELETE CASCADE,
  inv_id INTEGER NOT NULL REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
  saved_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT saved_vehicle_unique UNIQUE (account_id, inv_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_vehicle_account_id ON public.saved_vehicle(account_id);
