
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, CartItem } from '@/data/products';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] };

interface CartContextType {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id === action.product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { product: action.product, quantity: 1 }];
      }
      
      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems)
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.productId);
      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.product.id === action.productId
          ? { ...item, quantity: Math.max(0, action.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems)
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      };
      
    case 'LOAD_CART': {
      return {
        items: action.items,
        total: calculateTotal(action.items),
        itemCount: calculateItemCount(action.items)
      };
    }
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });

  const { user } = useAuth();
  const { toast } = useToast();

  // Generate user-specific storage key
  const getStorageKey = (userId: string | null) => {
    return userId ? `shahiMedicalsCart_${userId}` : 'shahiMedicalsCart_guest';
  };

  // Load cart from localStorage when user changes
  useEffect(() => {
    if (user) {
      // Load user-specific cart
      const userStorageKey = getStorageKey(user.id);
      const savedCart = localStorage.getItem(userStorageKey);
      
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', items: cartItems });
        } catch (error) {
          console.error('Error loading user cart from localStorage:', error);
          dispatch({ type: 'CLEAR_CART' });
        }
      } else {
        // No saved cart for this user, start fresh
        dispatch({ type: 'CLEAR_CART' });
      }
    } else {
      // User logged out, clear cart
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user]);

  // Save cart to localStorage whenever it changes (only for logged-in users)
  useEffect(() => {
    if (user) {
      const userStorageKey = getStorageKey(user.id);
      localStorage.setItem(userStorageKey, JSON.stringify(state.items));
    }
  }, [state.items, user]);

  const addItem = async (product: Product) => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive",
      });
      return;
    }

    dispatch({ type: 'ADD_ITEM', product });
    
    try {
      // Sync with Supabase
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: product.id,
          quantity: state.items.find(item => item.product.id === product.id)?.quantity + 1 || 1
        });

      if (error) {
        console.error('Error syncing cart with database:', error);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const removeItem = async (productId: string) => {
    if (!user) return;

    dispatch({ type: 'REMOVE_ITEM', productId });
    
    try {
      // Remove from Supabase
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Error removing item from database:', error);
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
    
    try {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
      } else {
        // Update quantity in Supabase
        const { error } = await supabase
          .from('cart_items')
          .upsert({
            user_id: user.id,
            product_id: productId,
            quantity
          });

        if (error) {
          console.error('Error updating cart in database:', error);
        }
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
    
    if (user) {
      try {
        // Clear from Supabase
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (error) {
          console.error('Error clearing cart from database:', error);
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem, 
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
