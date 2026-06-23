
-- Drop the recursive admin policy on profiles
DROP POLICY IF EXISTS "admin_profiles_select" ON public.profiles;

-- Create a security definer function to get role without triggering RLS
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Re-create admin policies on all tables using the security-definer function
-- (avoids recursive self-reference in profiles)

-- profiles: admins can read all profiles
CREATE POLICY "admin_profiles_select_all" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.get_my_role() = 'admin');

-- categories
DROP POLICY IF EXISTS "categories_insert_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_update_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_delete_admin" ON public.categories;
CREATE POLICY "categories_insert_admin" ON public.categories FOR INSERT TO authenticated WITH CHECK (public.get_my_role() = 'admin');
CREATE POLICY "categories_update_admin" ON public.categories FOR UPDATE TO authenticated USING (public.get_my_role() = 'admin');
CREATE POLICY "categories_delete_admin" ON public.categories FOR DELETE TO authenticated USING (public.get_my_role() = 'admin');

-- products
DROP POLICY IF EXISTS "products_insert_admin" ON public.products;
DROP POLICY IF EXISTS "products_update_admin" ON public.products;
DROP POLICY IF EXISTS "products_delete_admin" ON public.products;
CREATE POLICY "products_insert_admin" ON public.products FOR INSERT TO authenticated WITH CHECK (public.get_my_role() = 'admin');
CREATE POLICY "products_update_admin" ON public.products FOR UPDATE TO authenticated USING (public.get_my_role() = 'admin');
CREATE POLICY "products_delete_admin" ON public.products FOR DELETE TO authenticated USING (public.get_my_role() = 'admin');

-- inventory
DROP POLICY IF EXISTS "inventory_insert_admin" ON public.inventory;
DROP POLICY IF EXISTS "inventory_update_admin" ON public.inventory;
DROP POLICY IF EXISTS "inventory_delete_admin" ON public.inventory;
CREATE POLICY "inventory_insert_admin" ON public.inventory FOR INSERT TO authenticated WITH CHECK (public.get_my_role() = 'admin');
CREATE POLICY "inventory_update_admin" ON public.inventory FOR UPDATE TO authenticated USING (public.get_my_role() = 'admin');
CREATE POLICY "inventory_delete_admin" ON public.inventory FOR DELETE TO authenticated USING (public.get_my_role() = 'admin');

-- middlemen
DROP POLICY IF EXISTS "middlemen_insert_admin" ON public.middlemen;
DROP POLICY IF EXISTS "middlemen_update_admin" ON public.middlemen;
DROP POLICY IF EXISTS "middlemen_delete_admin" ON public.middlemen;
CREATE POLICY "middlemen_insert_admin" ON public.middlemen FOR INSERT TO authenticated WITH CHECK (public.get_my_role() IN ('admin', 'middleman'));
CREATE POLICY "middlemen_update_admin" ON public.middlemen FOR UPDATE TO authenticated USING (public.get_my_role() = 'admin' OR user_id = auth.uid());
CREATE POLICY "middlemen_delete_admin" ON public.middlemen FOR DELETE TO authenticated USING (public.get_my_role() = 'admin');

-- orders
DROP POLICY IF EXISTS "orders_select_auth" ON public.orders;
DROP POLICY IF EXISTS "orders_update_auth" ON public.orders;
DROP POLICY IF EXISTS "orders_delete_admin" ON public.orders;
CREATE POLICY "orders_select_auth" ON public.orders FOR SELECT TO authenticated USING (
  public.get_my_role() = 'admin'
  OR middleman_id IN (SELECT id FROM public.middlemen WHERE user_id = auth.uid())
);
CREATE POLICY "orders_update_auth" ON public.orders FOR UPDATE TO authenticated USING (
  public.get_my_role() = 'admin'
  OR middleman_id IN (SELECT id FROM public.middlemen WHERE user_id = auth.uid())
);
CREATE POLICY "orders_delete_admin" ON public.orders FOR DELETE TO authenticated USING (public.get_my_role() = 'admin');

-- order_items
DROP POLICY IF EXISTS "order_items_update_admin" ON public.order_items;
DROP POLICY IF EXISTS "order_items_delete_admin" ON public.order_items;
CREATE POLICY "order_items_update_admin" ON public.order_items FOR UPDATE TO authenticated USING (public.get_my_role() = 'admin');
CREATE POLICY "order_items_delete_admin" ON public.order_items FOR DELETE TO authenticated USING (public.get_my_role() = 'admin');
