import api from './axios';

export interface Item {
    id: string;
    title: string;
    type: 'lost' | 'found';
    location: string;
    description: string;
    status: 'pending' | 'returned';
    imageUrl?: string;
    reportedBy: string;
    createdAt: string;
}

export interface Claim {
    id: string;
    itemId: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    item?: Item;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    isProofRequest?: boolean;
    timestamp: string;
}

// Auth
export const login = async (campusId: string, password: string) => {
    const { data } = await api.post('/api/auth/login', { campusId, password });
    return data;
};

export const getProfile = async () => {
    const { data } = await api.get('/api/users/profile');
    return data;
};

export const updateProfile = async (profileData: any) => {
    const { data } = await api.put('/api/users/profile', profileData);
    return data;
};

// Items
export const getItems = async (type?: 'lost' | 'found') => {
    const { data } = await api.get('/api/items', { params: { type } });
    return data;
};

export const createItem = async (itemData: Partial<Item>) => {
    const { data } = await api.post('/api/items', itemData);
    return data;
};

export const uploadItemImage = async (itemId: string, imageBase64: string) => {
    const { data } = await api.post(`/api/items/${itemId}/image`, { image: imageBase64 });
    return data;
};

// Claims
export const createClaim = async (itemId: string) => {
    const { data } = await api.post('/api/claims', { itemId });
    return data;
};

export const getMyClaims = async () => {
    const { data } = await api.get('/api/claims/my');
    return data;
};

export const getClaimChat = async (claimId: string) => {
    const { data } = await api.get(`/api/claims/${claimId}/chat`);
    return data;
};

export const sendChatMessage = async (claimId: string, content: string) => {
    const { data } = await api.post(`/api/claims/${claimId}/chat`, { content });
    return data;
};

// Admin
export const getPendingClaims = async () => {
    const { data } = await api.get('/api/admin/claims/pending');
    return data;
};

export const approveClaim = async (claimId: string, remarks?: string) => {
    const { data } = await api.post(`/api/admin/claims/${claimId}/approve`, { remarks });
    return data;
};

export const rejectClaim = async (claimId: string, remarks?: string) => {
    const { data } = await api.post(`/api/admin/claims/${claimId}/reject`, { remarks });
    return data;
};

export const getAnalytics = async () => {
    const { data } = await api.get('/api/admin/analytics');
    return data;
};
