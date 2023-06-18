'use client'
import React, { useEffect, useState } from 'react'
import { Box, Stack, Text, Button, useToast } from '@chakra-ui/react'
import CampaignCard from '@/components/campaign/CampaignCard'
import { BsPlus } from 'react-icons/bs'
import Link from 'next/link'
import BackendAxios from '@/utils/axios'

const Page = () => {
    const Toast = useToast({ position: 'top-right' })
    const dummyCampaigns = [
        {
            id: '1',
            title: 'save our cows',
            userName: 'john doe',
            coverImage: 'https://t3.ftcdn.net/jpg/04/19/34/24/360_F_419342418_pBHSf17ZBQn77E7z3OWcXrWfCuxZkc3Q.jpg',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore illo quos facere asperiores. Nulla harum unde praesentium hic aut nisi iusto recusandae, beatae aspernatur.'
        },
        {
            id: '2',
            title: 'help me heal',
            userName: 'john doe',
            coverImage: 'https://www.hippo.co.za/globalassets/images/blog/your-guide-to-switching-medical-aid/medical-aid-2.jpg',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore illo quos facere asperiores. Nulla harum unde praesentium hic aut nisi iusto recusandae, beatae aspernatur.'
        },
        {
            id: '3',
            title: 'save your future',
            userName: 'john doe',
            coverImage: 'https://www.hippo.co.za/globalassets/images/blog/your-guide-to-switching-medical-aid/medical-aid-2.jpg',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore illo quos facere asperiores. Nulla harum unde praesentium hic aut nisi iusto recusandae, beatae aspernatur.'
        },
        {
            id: '4',
            title: 'education funds',
            userName: 'john doe',
            coverImage: 'https://www.hippo.co.za/globalassets/images/blog/your-guide-to-switching-medical-aid/medical-aid-2.jpg',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore illo quos facere asperiores. Nulla harum unde praesentium hic aut nisi iusto recusandae, beatae aspernatur.'
        },
        {
            id: '5',
            title: 'startup funds',
            userName: 'john doe',
            coverImage: 'https://www.hippo.co.za/globalassets/images/blog/your-guide-to-switching-medical-aid/medical-aid-2.jpg',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore illo quos facere asperiores. Nulla harum unde praesentium hic aut nisi iusto recusandae, beatae aspernatur.'
        },
        {
            id: '6',
            title: 'travel funds',
            userName: 'john doe',
            coverImage: 'https://www.hippo.co.za/globalassets/images/blog/your-guide-to-switching-medical-aid/medical-aid-2.jpg',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore illo quos facere asperiores. Nulla harum unde praesentium hic aut nisi iusto recusandae, beatae aspernatur.'
        },
    ]

    const [campaigns, setCampaigns] = useState([])
    useEffect(() => {
        BackendAxios.get("/api/user-campaigns").then(res => {
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
                >Your Campaigns</Text>
                <Link href={'/dashboard/campaigns/create'}>
                    <Button colorScheme='yellow' rounded={'full'} leftIcon={<BsPlus size={24} />}>
                        Create New
                    </Button>
                </Link>
            </Stack>
            <Stack
                direction={['column', 'row']} flexWrap={'wrap'}
                gap={[4, 8, 16]} justifyContent={'flex-start'}
            >
                {
                    campaigns.map((campaign, key) => (
                        <CampaignCard
                            key={key}
                            coverImage={campaign.file_path ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${campaign.file_path}` : "https://idea.batumi.ge/files/default.jpg"}
                            title={campaign.title}
                            userName={campaign.status ? "Published" : "In Review"}
                            description={campaign.description}
                            link={`/dashboard/campaigns/view/${campaign.id}`}
                        />
                    ))
                }
            </Stack>
        </>
    )
}

export default Page