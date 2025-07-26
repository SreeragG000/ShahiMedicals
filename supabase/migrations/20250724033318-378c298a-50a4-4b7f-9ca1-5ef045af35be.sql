-- Enable real-time for orders table
ALTER TABLE public.orders REPLICA IDENTITY FULL;

-- Enable real-time for order_items table  
ALTER TABLE public.order_items REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;