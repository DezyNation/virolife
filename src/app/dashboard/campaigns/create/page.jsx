'use client'
import React from 'react';
import {
    Text,
    Box,
    Image,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    Textarea,
    HStack
} from '@chakra-ui/react';

const Page = () => {
    return (
        <>
            <Text pb={4}>Create New Campaign</Text>
            <FormControl py={4}>
                <FormLabel>Enter title for your campaign</FormLabel>
                <Input
                    w={'full'} variant={'flushed'}
                    fontSize={['xl', '2xl', '3xl']}
                    className='serif' p={2}
                />
            </FormControl>
            <Box p={4}>
                <Text pb={4} fontWeight={'semibold'}>Upload Images</Text>
                <VStack
                    w={['full', 'lg']} h={'xs'}
                    rounded={16} border={'1px'}
                    borderStyle={'dashed'}
                    bg={'#FAFAFA'} cursor={'pointer'}
                    justifyContent={'center'}
                >
                    <Text>Click to Upload Or Drop Your Files Here...</Text>
                </VStack>
            </Box>
            <FormControl py={4}>
                <FormLabel>Your message</FormLabel>
                <Textarea w={'full'} placeholder='Tell us about your campaign'></Textarea>
            </FormControl>
            <HStack justifyContent={'flex-end'} py={4}>
                <Button colorScheme='yellow'>Send For Review</Button>
            </HStack>
        </>
    )
}

export default Page