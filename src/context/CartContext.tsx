"use client";

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product, ProductVariant, ProductSize } from '@/data/store';

// Extended CartItem interface to handle both complex and simple product structures
interface CartItem {
  id: string;
  product: Product | any; // Allow for Sanity product structure
  quantity: number;
  variant?: ProductVariant | null;
  size?: ProductSize | null;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: any; quantity: number; variant?: ProductVariant | null; size?: ProductSize | null } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' };

interface CartContextType {
  state: CartState;
  addToCart: (product: any, quantity: number, variant?: ProductVariant | null, size?: ProductSize | null) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  isOpen: false
};

function generateCartItemId(product: any, variant?: ProductVariant | null, size?: ProductSize | null): string {
  let id = product.id || product._id;
  if (variant) id += `-${variant.id}`;
  if (size) id += `-${size.id}`;
  return id;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, variant, size } = action.payload;
      const cartItemId = generateCartItemId(product, variant, size);
      
      const existingItemIndex = state.items.findIndex(item => 
        generateCartItemId(item.product, item.variant, item.size) === cartItemId
      );
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        
        return {
          ...state,
          items: updatedItems
        };
      } else {
        // Add new item
        return {
          ...state,
          items: [...state.items, { id: cartItemId, product, quantity, variant, size }]
        };
      }
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.itemId)
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.itemId 
            ? { ...item, quantity: action.payload.quantity } 
            : item
        )
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      };
    
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      };
    
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items && Array.isArray(parsedCart.items)) {
          parsedCart.items.forEach((item: CartItem) => {
            dispatch({
              type: 'ADD_ITEM',
              payload: {
                product: item.product,
                quantity: item.quantity,
                variant: item.variant,
                size: item.size
              }
            });
          });
        }
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({ items: state.items }));
  }, [state.items]);
  
  // Calculate total items
  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate subtotal
  const subtotal = state.items.reduce((total, item) => {
    const price = item.variant ? item.variant.price : item.product.price;
    return total + price * item.quantity;
  }, 0);
  
  // Cart actions
  const addToCart = (product: any, quantity: number, variant?: ProductVariant | null, size?: ProductSize | null) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, variant, size } });
  };
  
  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };
  
  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };
  
  const value = {
    state,
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    closeCart,
    totalItems,
    subtotal
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 