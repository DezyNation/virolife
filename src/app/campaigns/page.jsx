'use client'
import React from 'react'
import { Box, Stack, Text } from '@chakra-ui/react'
import CampaignCard from '@/components/campaign/CampaignCard'

const Page = () => {
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

    return (
        <>
            <Box minH={'100vh'} p={[8, 16, 24]}>
                <Text
                    className='serif' fontSize={'xl'}
                    fontWeight={'semibold'} mb={12}
                >Browse Social Campaigns</Text>
                <Stack
                    direction={['column', 'row']} flexWrap={'wrap'}
                    gap={[8, 4, 16]} justifyContent={'flex-start'}
                >
                    {
                        dummyCampaigns.map((campaign, key) => (
                            <CampaignCard
                                coverImage={campaign.coverImage}
                                title={campaign.title}
                                userName={campaign.userName}
                                description={campaign.description}
                            />
                        ))
                    }
                </Stack>
            </Box>
        </>
    )
}

export default Page