'use client'
import React, { useEffect, useState } from 'react'
import { Box, Stack, Text, Button, useToast } from '@chakra-ui/react'
import CampaignCard from '@/components/campaign/CampaignCard'
import { BsPlus } from 'react-icons/bs'
import Link from 'next/link'
import BackendAxios from '@/utils/axios'

const Page = () => {
    const Toast = useToast({ position: 'top-right' })
    const [campaigns, setCampaigns] = useState([])
    useEffect(() => {
        BackendAxios.get("/api/campaign").then(res => {
            setCampaigns(res.data)
        }).catch(err => {
            Toast({
                status: 'error',
                description: err?.response?.data?.message || err?.response?.data || err?.message
            })
        })
    }, [])

    return (
        <>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Text
                    className='serif' fontSize={'xl'}
                    fontWeight={'semibold'} mb={12}
                >Campaigns</Text>
            </Stack>
            <Stack
                direction={['column', 'row']} flexWrap={'wrap'}
                gap={[4, 8, 16]} justifyContent={'flex-start'}
            >
                {
                    campaigns.filter(item => (item.status != "pending" && item.status != "rejected")).map((campaign, key) => (
                        <CampaignCard
                            key={key}
                            coverImage={campaign.file_path ? `https://edulec.in/storage/${campaign.file_path}` : "https://idea.batumi.ge/files/default.jpg"}
                            title={campaign.title}
                            userName={campaign.status}
                            description={campaign.description}
                            link={`/campaigns/${campaign.id}`}
                        />
                    ))
                }
            </Stack>
        </>
    )
}

export default Page