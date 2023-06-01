"use client"
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
    Box,
    Text,
    Image,
    Stack,
    Button,
    VStack
} from '@chakra-ui/react'

const Carousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <Box w={'full'} h={['auto', '100vh']}>
            <Slider {...settings}>
                <Box>
                    <Stack p={8} direction={['column', 'row']} w={'full'} justifyContent={'space-between'} gap={12}>
                        <Image w={['full', '4xl']} src='https://www.nationstrust.com/images/life-moments/easily-save-money-1.jpg' />
                        <VStack>
                            <Text fontSize={['3xl', '6xl']} className='serif' textAlign={['center', 'right']}>
                                Thrive<br />Your<br />Income
                            </Text>
                            <Button p={2} w={['56']} mt={12} rounded={6} bgColor={'yellow.400'} fontSize={'lg'} fontWeight={'semibold'} color={'#333'}>Watch Video</Button>
                        </VStack>
                    </Stack>
                    <Box w={'95vw'} h={'0.5'} mx={'auto'} bgColor={'yellow.400'}></Box>
                    <Text p={8} textAlign={'center'} className='serif' fontSize={['md', 'xl']}>You either master money, or on some level, money masters you!</Text>
                </Box>
                <Box>
                    <Stack p={8} direction={['column', 'row']} w={'full'} justifyContent={'space-between'} gap={12}>
                        <Image w={['full', '4xl']} src='https://www.nationstrust.com/images/life-moments/easily-save-money-1.jpg' />
                        <VStack>
                            <Text fontSize={['3xl', '6xl']} className='serif' textAlign={['center', 'right']}>
                                Boost<br />Your<br />Skills
                            </Text>
                            <Button p={2} w={['56']} mt={12} rounded={6} bgColor={'yellow.400'} fontSize={'lg'} fontWeight={'semibold'} color={'#333'}>Watch Video</Button>
                        </VStack>
                    </Stack>
                    <Box w={'95vw'} h={'0.5'} mx={'auto'} bgColor={'yellow.400'}></Box>
                    <Text p={8} textAlign={'center'} className='serif' fontSize={['md', 'xl']}>You either master money, or on some level, money masters you!</Text>
                </Box>
                <Box>
                    <Stack p={8} direction={['column', 'row']} w={'full'} justifyContent={'space-between'} gap={8}>
                        <Image w={['full', '4xl']} src='https://www.nationstrust.com/images/life-moments/easily-save-money-1.jpg' />
                        <VStack>
                            <Text fontSize={['3xl', '6xl']} className='serif' textAlign={['center', 'right']}>
                                Importance<br />Of Passive<br />Income
                            </Text>
                            <Button p={2} w={['56']} mt={12} rounded={6} bgColor={'yellow.400'} fontSize={'lg'} fontWeight={'semibold'} color={'#333'}>Watch Video</Button>
                        </VStack>
                    </Stack>
                    <Box w={'95vw'} h={'0.5'} mx={'auto'} bgColor={'yellow.400'}></Box>
                    <Text p={8} textAlign={'center'} className='serif' fontSize={['md', 'xl']}>You either master money, or on some level, money masters you!</Text>
                </Box>
            </Slider>
        </Box>
    );
};

export default Carousel;
