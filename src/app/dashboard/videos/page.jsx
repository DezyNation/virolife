'use client'
import React from 'react'
import {
    Box,
    Text
} from '@chakra-ui/react'

const Page = () => {
    return (
        <>
            <iframe
                width="968"
                height="560"
                style={{ borderRadius: '32px' }}
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
            <Box py={4}>
                <Text fontSize={'xl'} fontWeight={'semibold'}>
                    Watch this short video to unlock ₹280
                </Text>
            </Box>
            <Box
                pos={'fixed'}
                top={16} right={4}
                p={4} bgColor={'#FFF'}
                rounded={8} zIndex={99}
                boxShadow={'lg'}
            >
                <Text fontSize={'xs'}>Your reward will unlock in</Text>
                <Text fontSize={'2xl'} fontWeight={'semibold'} color={'darkslategray'}>00 : 00</Text>
            </Box>
        </>
    )
}

export default Page