export interface MenuItem {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
  }
  
  export interface Reservation {
    id: string;
    name: string;
    date: string;
    time: string;
    guests: number;
    phone: string;
    status: 'pending' | 'confirmed';
    orders: {
      itemId: string;
      itemName: string;  // ✅ Add this
      quantity: number;
    }[];
  }
  
  