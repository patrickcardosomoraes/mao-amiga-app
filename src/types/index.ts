export interface Campaign {
    id: string
    title: string
    description: string
    imageUrl?: string
    videoUrl?: string
    goal: number
    raised: number
    pixKey: string
    beneficiaryName: string
    status: 'active' | 'paused' | 'completed' | 'reported'
    createdAt: string
    creatorId: string
}

export interface User {
    id: string
    email: string
    name?: string
    avatarUrl?: string
}

export interface Supporter {
    id: string
    campaignId: string
    name: string
    amount: number
    message?: string
    createdAt: string
}

export interface Report {
    id: string
    campaignId: string
    reporterId?: string
    reason: string
    description?: string
    status: 'pending' | 'reviewed' | 'resolved'
    createdAt: string
}

export interface AnalyticsEvent {
    id: string
    campaignId: string
    eventType: 'view' | 'share' | 'pix_click' | 'copy_key'
    createdAt: string
}
