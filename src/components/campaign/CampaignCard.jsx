'use client'
import { Box, Image, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

const CampaignCard = (props) => {
    return (
        <>
            <Link href={'/campaigns/save-our-cows'}>
                <Box w={['100%', 'xs']}>
                    <Image
                        src={props.coverImage}
                        rounded={16} w={'full'} mb={4}
                        transition={'all .3s ease'}
                        _hover={{ boxShadow: 'xl' }}
                    />
                    <Text
                        fontSize={['xl', 'lg', 'xl']}
                        textTransform={'capitalize'}
                        fontWeight={'semibold'}
                    >{props.title}</Text>
                    <Text
                        fontSize={['md', 'sm', 'md']}
                        fontWeight={'medium'}
                        textTransform={'capitalize'}
                        className='serif'>{props.userName}</Text>
                    <Text pt={2}>
                        {props.description?.slice(0, 60)}...
                    </Text>
                </Box>
            </Link>
        </>
    )
}

export default CampaignCard