import { useState } from 'react';
import { Package, ShoppingCart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Products from '@/components/admin/Products';
import Orders from '@/components/admin/Orders';

export default function Admin() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Admin Panel
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your product inventory and order information
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="mt-8">
            <Products />
          </TabsContent>
          
          <TabsContent value="orders" className="mt-8">
            <Orders />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}