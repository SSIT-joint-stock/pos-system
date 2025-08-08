import type { 
  Order, 
  OrderStatus, 
  PaymentStatus, 
  Table, 
  MenuItem, 
  Customer 
} from './index';

// Restaurant Order Types
export interface RestaurantOrder extends Order {
  restaurantId: string;
  tableId?: string;
  customerName?: string;
  customerPhone?: string;
  orderType: OrderType;
  serviceCharge: number;
  specialNotes?: string;
  estimatedTime?: number;
  actualTime?: number;
  items: RestaurantOrderItem[];
  table?: Table;
}

export enum OrderType {
  DINE_IN = 'DINE_IN',
  TAKEAWAY = 'TAKEAWAY',
  DELIVERY = 'DELIVERY',
  DRIVE_THROUGH = 'DRIVE_THROUGH'
}

export interface RestaurantOrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  modifiers?: SelectedModifier[];
  specialNotes?: string;
  status: OrderItemStatus;
  total: number;
  menuItem?: MenuItem;
}

export interface SelectedModifier {
  name: string;
  price: number;
}

export enum OrderItemStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SERVED = 'SERVED',
  CANCELLED = 'CANCELLED'
}

// Kitchen Display Types
export interface KitchenOrder {
  id: string;
  orderNumber: string;
  tableNumber?: string;
  orderType: OrderType;
  items: KitchenOrderItem[];
  totalItems: number;
  estimatedTime: number;
  elapsedTime: number;
  priority: OrderPriority;
  specialNotes?: string;
  createdAt: string;
}

export interface KitchenOrderItem {
  id: string;
  menuItemName: string;
  quantity: number;
  modifiers: string[];
  specialNotes?: string;
  status: OrderItemStatus;
  preparationTime: number;
}

export enum OrderPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// Reservation Types
export interface Reservation {
  id: string;
  restaurantId: string;
  tableId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  partySize: number;
  reservationDate: string;
  reservationTime: string;
  duration: number;
  status: ReservationStatus;
  specialRequests?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  table?: Table;
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SEATED = 'SEATED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}