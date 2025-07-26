import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Product } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductState {
  products: Product[];
}

type ProductAction =
  | { type: 'LOAD_PRODUCTS'; products: Product[] }
  | { type: 'ADD_PRODUCT'; product: Product }
  | { type: 'UPDATE_PRODUCT'; product: Product }
  | { type: 'DELETE_PRODUCT'; productId: string };

interface ProductContextType {
  state: ProductState;
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  fetchProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case 'LOAD_PRODUCTS':
      return { products: action.products };
      
    case 'ADD_PRODUCT':
      return { products: [...state.products, action.product] };
    
    case 'UPDATE_PRODUCT':
      return {
        products: state.products.map(product =>
          product.id === action.product.id ? action.product : product
        )
      };
    
    case 'DELETE_PRODUCT':
      return {
        products: state.products.filter(product => product.id !== action.productId)
      };
    
    default:
      return state;
  }
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, {
    products: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const products: Product[] = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: parseFloat(item.price.toString()),
        image: item.image_url || '',
        category: item.category || 'General',
        stock: item.stock_quantity,
        manufacturer: 'Shahi Medicals',
        prescription: false
      }));

      dispatch({ type: 'LOAD_PRODUCTS', products });
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image_url: productData.image,
          category: productData.category,
          stock_quantity: productData.stock,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newProduct: Product = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        price: parseFloat(data.price.toString()),
        image: data.image_url || '',
        category: data.category || 'General',
        stock: data.stock_quantity,
        manufacturer: 'Shahi Medicals',
        prescription: false
      };

      dispatch({ type: 'ADD_PRODUCT', product: newProduct });
      
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          image_url: product.image,
          category: product.category,
          stock_quantity: product.stock
        })
        .eq('id', product.id);

      if (error) {
        throw error;
      }

      dispatch({ type: 'UPDATE_PRODUCT', product });
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', productId);

      if (error) {
        throw error;
      }

      dispatch({ type: 'DELETE_PRODUCT', productId });
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  // Load products from Supabase on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{
      state,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      fetchProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};