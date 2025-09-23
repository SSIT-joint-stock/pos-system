enum StoreRole {
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
}
export interface StoreOwner {
  id: string;
  username: string;
  email: string;
}

export interface StoreMemberUser {
  id: string;
  username: string;
  email: string;
}

export interface StoreMember {
  storeId: string;
  userId: string;
  role: StoreRole;
  createdAt: string; // ISO datetime
  user: StoreMemberUser;
}

export interface StoreCount {
  products: number;
  categories: number;
  customer: number;
  members: number;
}

export interface Store {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  phone_number: string | null;
  address: string | null;
  business_hour: string | null;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  owner: StoreOwner;
  members: StoreMember[] | null;
  _count: StoreCount;
}

// Response từ API
export interface GetStoresResponse {
  success: boolean;
  meta: {
    timestamp: string;
    version: string;
  };
  data: Store[];
  message: string;
}
