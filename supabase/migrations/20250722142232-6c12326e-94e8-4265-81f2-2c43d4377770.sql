-- Create a security definer function to check admin status safely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );
END;
$$;

-- Drop and recreate the admin policies using the secure function
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

-- Recreate policies using the security definer function
CREATE POLICY "Admins can manage products" 
ON public.products FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can view all orders" 
ON public.orders FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can view all order items" 
ON public.order_items FOR SELECT 
USING (public.is_admin());