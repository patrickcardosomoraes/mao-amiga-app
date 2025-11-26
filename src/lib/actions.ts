"use server"

import { createClient } from "@/lib/supabase-server"
import { Campaign } from "@/types"

/**
 * Fetch all active campaigns
 */
export async function getCampaigns(): Promise<Campaign[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching campaigns:', error)
        return []
    }

    return data.map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        imageUrl: campaign.image_url,
        videoUrl: campaign.video_url,
        goal: parseFloat(campaign.goal),
        raised: parseFloat(campaign.raised),
        pixKey: campaign.pix_key,
        beneficiaryName: campaign.beneficiary_name,
        status: campaign.status,
        createdAt: campaign.created_at,
        creatorId: campaign.creator_id,
    }))
}

/**
 * Fetch a single campaign by ID
 */
export async function getCampaignById(id: string): Promise<Campaign | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching campaign:', error)
        return null
    }

    return {
        id: data.id,
        title: data.title,
        description: data.description,
        imageUrl: data.image_url,
        videoUrl: data.video_url,
        goal: parseFloat(data.goal),
        raised: parseFloat(data.raised),
        pixKey: data.pix_key,
        beneficiaryName: data.beneficiary_name,
        status: data.status,
        createdAt: data.created_at,
        creatorId: data.creator_id,
    }
}

/**
 * Create a new campaign
 */
export async function createCampaign(formData: {
    title: string
    description: string
    goal: number
    pixKey: string
    beneficiaryName: string
    imageUrl?: string
    videoUrl?: string
    creatorId: string
}): Promise<{ success: boolean; campaignId?: string; error?: string }> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('campaigns')
        .insert([
            {
                title: formData.title,
                description: formData.description,
                goal: formData.goal,
                pix_key: formData.pixKey,
                beneficiary_name: formData.beneficiaryName,
                image_url: formData.imageUrl,
                video_url: formData.videoUrl,
                creator_id: formData.creatorId,
            }
        ])
        .select()
        .single()

    if (error) {
        console.error('Error creating campaign:', error)
        return { success: false, error: error.message }
    }

    return { success: true, campaignId: data.id }
}

/**
 * Track analytics event
 */
export async function trackEvent(campaignId: string, eventType: 'view' | 'share' | 'pix_click' | 'copy_key') {
    const supabase = await createClient()
    const { error } = await supabase
        .from('campaign_analytics')
        .insert([
            {
                campaign_id: campaignId,
                event_type: eventType,
            }
        ])

    if (error) {
        console.error('Error tracking event:', error)
    }
}

/**
 * Add supporter to campaign
 */
export async function addSupporter(data: {
    campaignId: string
    name: string
    amount: number
    message?: string
}): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient()
    const { error } = await supabase
        .from('supporters')
        .insert([
            {
                campaign_id: data.campaignId,
                name: data.name,
                amount: data.amount,
                message: data.message,
            }
        ])

    if (error) {
        console.error('Error adding supporter:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

/**
 * Get supporters for a campaign
 */
export async function getSupporters(campaignId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('supporters')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching supporters:', error)
        return []
    }

    return data.map(supporter => ({
        id: supporter.id,
        campaignId: supporter.campaign_id,
        name: supporter.name,
        amount: parseFloat(supporter.amount),
        message: supporter.message,
        createdAt: supporter.created_at,
    }))
}
