// Felhasználói szerepkörök
export type UserRole = 'client' | 'provider' | 'admin';

// Felhasználói státusz
export type UserStatus = 'active' | 'banned' | 'deleted';

// Szolgáltatási kategóriák
export type ServiceCategory =
  | 'hair'
  | 'nails'
  | 'cosmetics'
  | 'barber'
  | 'massage'
  | 'tattoo'
  | 'piercing';

// Felhasználó interfész
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Koordináták
export interface Coordinates {
  lat: number;
  lng: number;
}

// Cím
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates: Coordinates;
}

// Szolgáltatás
export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // percben
  category: ServiceCategory;
  description?: string;
}

// Nyitvatartás
export interface OpeningHours {
  [key: string]: {
    isOpen: boolean;
    openTime?: string; // HH:mm formátum
    closeTime?: string; // HH:mm formátum
  };
}

// Szalon
export interface Salon {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  address: Address;
  phone?: string;
  email?: string;
  website?: string;
  categories: ServiceCategory[];
  services: Service[];
  openingHours: OpeningHours;
  images: string[];
  rating: number;
  reviewCount: number;
  viewCount: number;
  likeCount: number;
  bookingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Poszt
export interface Post {
  id: string;
  salonId: string;
  providerId: string;
  imageUrl: string;
  description: string;
  serviceCategory: ServiceCategory;
  location?: string;
  coordinates?: Coordinates;
  likes: string[]; // user ID-k
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Értékelés
export interface Review {
  id: string;
  salonId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

// Foglalás
export interface Booking {
  id: string;
  salonId: string;
  salonName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  serviceId: string;
  serviceName: string;
  date: Date;
  startTime: string; // HH:mm formátum
  endTime: string; // HH:mm formátum
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Kedvenc szalon
export interface Favorite {
  id: string;
  userId: string;
  salonId: string;
  createdAt: Date;
}

// Keresési szűrők
export interface SearchFilters {
  query?: string;
  categories?: ServiceCategory[];
  location?: Coordinates;
  radius?: number; // km-ben
  minRating?: number;
  priceRange?: {
    min: number;
    max: number;
  };
}

// Nézetek típusa
export type ViewMode = 'feed' | 'list';

// Auth Context típus
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}
