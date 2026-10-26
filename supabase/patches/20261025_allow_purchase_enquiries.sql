-- Run this once in Supabase SQL Editor after the initial schema has been applied.
-- Allows signed-in students to send purchase enquiries for sale listings as well as borrow requests for rent/lend listings.
drop policy if exists "requests insert valid requester" on public.borrow_requests;
create policy "requests insert valid requester"
on public.borrow_requests
for insert to authenticated
with check (
  requester_id = (select auth.uid())
  and owner_id <> (select auth.uid())
  and exists (
    select 1
    from public.listings l
    where l.id = listing_id
      and l.owner_id = borrow_requests.owner_id
      and l.status = 'available'
      and (
        (request_type = 'purchase' and l.type = 'sell')
        or (request_type = 'borrow' and l.type in ('rent', 'lend'))
      )
  )
);
