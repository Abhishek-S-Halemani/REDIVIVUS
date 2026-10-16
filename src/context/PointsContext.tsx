import React, { createContext, useContext, useState, useMemo } from 'react';
import { MarketplaceProduct, SellerMessage, CustomerLocation } from '../types';
import { RECYCLED_PRODUCTS, CUSTOMER_LOCATIONS, getDistanceForProduct } from '../data/marketplaceData';

export interface PointsTransaction {
  id: string;
  type: 'earned' | 'spent' | 'discount';
  amount: number;
  description: string;
  timestamp: string;
}

export interface MarketplaceUser {
  name: string;
  email: string;
  contactNumber: string;
  isLoggedIn: boolean;
  joinedAt?: string;
}

interface PointsContextType {
  userPoints: number;
  userProfile: MarketplaceUser | null;
  isMarketplaceMember: boolean;
  isAuthModalOpen: boolean;
  authCustomMessage: string;
  openAuthModal: (customMessage?: string) => void;
  closeAuthModal: () => void;
  joinMarketplace: (profile: { name: string; email: string; contactNumber: string }) => void;
  logoutMarketplace: () => void;
  products: MarketplaceProduct[];
  nearbyProducts: MarketplaceProduct[];
  customerLocation: CustomerLocation;
  setCustomerLocation: (loc: CustomerLocation) => void;
  maxDistanceKm: number;
  setMaxDistanceKm: (km: number) => void;
  transactions: PointsTransaction[];
  conversations: Record<string, SellerMessage[]>;
  earnPoints: (amount: number, reason: string) => void;
  buyProductWithPoints: (productId: string) => { success: boolean; message: string };
  requestDiscount: (productId: string, offeredPoints: number, userNote?: string) => Promise<{
    status: 'accepted' | 'countered';
    acceptedPoints: number;
    sellerNote: string;
  }>;
  sendMessageToSeller: (productId: string, text: string) => Promise<void>;
  resetProductDiscount: (productId: string) => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

const INITIAL_CONVERSATIONS: Record<string, SellerMessage[]> = {
  'mp-1': [
    {
      id: 'm1-1',
      sender: 'seller',
      text: 'Studio Reforge: Welcome! 0.8 km from your location. We accept points negotiation & local zero-emission pickup.',
      timestamp: 'Today, 10:14 AM',
    },
  ],
  'mp-2': [
    {
      id: 'm2-1',
      sender: 'seller',
      text: 'Kinetics Lab: Located 1.4 km away in Greenpoint. Propose a point discount and come inspect the reclaimed brass.',
      timestamp: 'Today, 11:02 AM',
    },
  ],
};

export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userPoints, setUserPoints] = useState<number>(2450);
  const [userProfile, setUserProfile] = useState<MarketplaceUser | null>(() => {
    try {
      const saved = localStorage.getItem('redivivus_mp_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authCustomMessage, setAuthCustomMessage] = useState<string>('');

  const [customerLocation, setCustomerLocation] = useState<CustomerLocation>(CUSTOMER_LOCATIONS[0]);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(10); // default to nearby (< 10 km)
  const [products, setProducts] = useState<MarketplaceProduct[]>(RECYCLED_PRODUCTS);
  const [conversations, setConversations] = useState<Record<string, SellerMessage[]>>(INITIAL_CONVERSATIONS);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([
    {
      id: 'tx-1',
      type: 'earned',
      amount: 1200,
      description: 'Welcome Bonus: Circular Economy Onboarding',
      timestamp: 'Yesterday',
    },
    {
      id: 'tx-2',
      type: 'earned',
      amount: 1250,
      description: 'Riddance Clearance Reward: 24kg E-Waste Recycled',
      timestamp: 'Today',
    },
  ]);

  const isMarketplaceMember = !!userProfile?.isLoggedIn;

  const openAuthModal = (customMessage?: string) => {
    setAuthCustomMessage(customMessage || '');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthCustomMessage('');
  };

  const joinMarketplace = (profile: { name: string; email: string; contactNumber: string }) => {
    const newProfile: MarketplaceUser = {
      ...profile,
      isLoggedIn: true,
      joinedAt: new Date().toISOString(),
    };
    setUserProfile(newProfile);
    try {
      localStorage.setItem('redivivus_mp_user', JSON.stringify(newProfile));
    } catch (e) {
      console.error(e);
    }
  };

  const logoutMarketplace = () => {
    setUserProfile(null);
    try {
      localStorage.removeItem('redivivus_mp_user');
    } catch (e) {
      console.error(e);
    }
  };

  // Recalculate distance for each product dynamically based on customer's selected location
  const localizedProducts = useMemo(() => {
    return products.map((p) => ({
      ...p,
      distanceKm: getDistanceForProduct(p, customerLocation.id),
    }));
  }, [products, customerLocation.id]);

  // Dynamic nearby products sorted by proximity, filtered to user's distance radius
  const nearbyProducts = useMemo(() => {
    return localizedProducts
      .filter((p) => p.distanceKm <= maxDistanceKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [localizedProducts, maxDistanceKm]);

  const earnPoints = (amount: number, reason: string) => {
    setUserPoints((prev) => prev + amount);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: 'earned',
        amount,
        description: reason,
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  const buyProductWithPoints = (productId: string): { success: boolean; message: string } => {
    if (!isMarketplaceMember) {
      openAuthModal('Please join Market Place to use your Eco Points and complete purchases!');
      return { success: false, message: 'Market Place account required.' };
    }

    const product = products.find((p) => p.id === productId);
    if (!product) {
      return { success: false, message: 'Recycled item not found.' };
    }

    const priceInPoints = product.negotiatedPoints ?? product.points;

    if (userPoints < priceInPoints) {
      const diff = priceInPoints - userPoints;
      return {
        success: false,
        message: `Need ${diff.toLocaleString()} more Points. Propose a discount below or recycle via Riddance!`,
      };
    }

    // Deduct points
    setUserPoints((prev) => prev - priceInPoints);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: 'spent',
        amount: priceInPoints,
        description: `Acquired: ${product.title}`,
        timestamp: 'Just now',
      },
      ...prev,
    ]);

    return {
      success: true,
      message: `Acquired "${product.title}" for ${priceInPoints.toLocaleString()} Points! Local pickup coordinates sent.`,
    };
  };

  const requestDiscount = async (
    productId: string,
    offeredPoints: number,
    userNote?: string
  ): Promise<{ status: 'accepted' | 'countered'; acceptedPoints: number; sellerNote: string }> => {
    if (!isMarketplaceMember) {
      openAuthModal('Please join Market Place to negotiate discounts with sellers!');
      return { status: 'countered', acceptedPoints: offeredPoints, sellerNote: 'Join Market Place first!' };
    }

    const product = products.find((p) => p.id === productId);
    const originalPoints = product ? product.points : 500;
    const discountPercent = Math.round(((originalPoints - offeredPoints) / originalPoints) * 100);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Buyer offer
    const buyerMsg: SellerMessage = {
      id: `msg-${Date.now()}-b`,
      sender: 'buyer',
      text: userNote || `Offer: ${offeredPoints.toLocaleString()} PTS (-${discountPercent}%)`,
      timestamp: now,
      pointsOffer: offeredPoints,
      isOffer: true,
      status: 'pending',
    };

    setConversations((prev) => ({
      ...prev,
      [productId]: [...(prev[productId] || []), buyerMsg],
    }));

    // Swift evaluation (300ms)
    await new Promise((r) => setTimeout(r, 300));

    let status: 'accepted' | 'countered' = 'accepted';
    let acceptedPoints = offeredPoints;
    let sellerNote = '';

    if (discountPercent <= 30 && discountPercent >= 0) {
      status = 'accepted';
      acceptedPoints = offeredPoints;
      sellerNote = `Offer of ${offeredPoints.toLocaleString()} PTS accepted! Price updated for checkout.`;
    } else if (discountPercent > 30 && discountPercent <= 50) {
      status = 'countered';
      acceptedPoints = Math.round(originalPoints * 0.75); // 25% discount
      sellerNote = `Counter-offer: We can do ${acceptedPoints.toLocaleString()} PTS (-25%). Price updated!`;
    } else {
      status = 'countered';
      acceptedPoints = Math.round(originalPoints * 0.85); // 15% discount
      sellerNote = `Best nearby discount: ${acceptedPoints.toLocaleString()} PTS (-15%). Price updated!`;
    }

    // Update product price
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, negotiatedPoints: acceptedPoints } : p))
    );

    // Seller response
    const sellerMsg: SellerMessage = {
      id: `msg-${Date.now()}-s`,
      sender: 'seller',
      text: sellerNote,
      timestamp: now,
      pointsOffer: acceptedPoints,
      isOffer: true,
      status: 'accepted',
    };

    setConversations((prev) => ({
      ...prev,
      [productId]: [...(prev[productId] || []), sellerMsg],
    }));

    return { status, acceptedPoints, sellerNote };
  };

  const sendMessageToSeller = async (productId: string, text: string): Promise<void> => {
    if (!isMarketplaceMember) {
      openAuthModal('Please join Market Place to send messages to sellers!');
      return;
    }

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: SellerMessage = {
      id: `msg-${Date.now()}`,
      sender: 'buyer',
      text,
      timestamp: now,
    };

    setConversations((prev) => ({
      ...prev,
      [productId]: [...(prev[productId] || []), newMsg],
    }));

    setTimeout(() => {
      const sellerReply: SellerMessage = {
        id: `msg-${Date.now()}-reply`,
        sender: 'seller',
        text: 'Message received! We are local and ready for pickup or point negotiation.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setConversations((prev) => ({
        ...prev,
        [productId]: [...(prev[productId] || []), sellerReply],
      }));
    }, 450);
  };

  const resetProductDiscount = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, negotiatedPoints: undefined } : p))
    );
  };

  return (
    <PointsContext.Provider
      value={{
        userPoints,
        userProfile,
        isMarketplaceMember,
        isAuthModalOpen,
        authCustomMessage,
        openAuthModal,
        closeAuthModal,
        joinMarketplace,
        logoutMarketplace,
        products: localizedProducts,
        nearbyProducts,
        customerLocation,
        setCustomerLocation,
        maxDistanceKm,
        setMaxDistanceKm,
        transactions,
        conversations,
        earnPoints,
        buyProductWithPoints,
        requestDiscount,
        sendMessageToSeller,
        resetProductDiscount,
      }}
    >
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};
