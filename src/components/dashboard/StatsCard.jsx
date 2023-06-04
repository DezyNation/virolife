'use client'
import React from 'react'
import {
    Box,
    Text,
    HStack,
    VStack
} from '@chakra-ui/react'

const StatsCard = ({ icon, title, quantity }) => {
    return (
        <>
            <Box w={['full', '64']} p={4} bgColor={'blanchedalmond'} rounded={4} boxShadow={'md'}>
                <HStack gap={4}>
                    <Box boxSize={'12'} display={'grid'} placeContent={'center'}>
                    {icon}
                    </Box>
                    <Box>
                        <Text fontSize={'xs'} color={'#666'} textTransform={'capitalize'}>{title}</Text>
                        <Text fontSize={'xl'} fontWeight={'semibold'} textTransform={'capitalize'}>{quantity || 0}</Text>
                    </Box>
                </HStack>
            </Box>
        </>
    )
}

export default StatsCard