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
    Button
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
        <Box w={'full'} h={['70vh', '100vh']} className='serif'>
            <Slider {...settings}>
                <Box className='serif'>
                    <Stack p={8} direction={['column', 'row']} w={'full'} justifyContent={'space-between'} gap={12}>
                        <Image w={['full', '4xl']} src='https://www.nationstrust.com/images/life-moments/easily-save-money-1.jpg' />
                        <Box>
                            <Text fontSize={['xl', '6xl']} textAlign={['center', 'right']}>
                                Thrive<br />Your<br />Income
                            </Text>
                            <Button p={2} w={['56']} mt={12} rounded={6} bgColor={'yellow.400'} fontSize={'lg'} fontWeight={'semibold'} color={'#333'}>Watch Video</Button>
                        </Box>
                    </Stack>
                    <Text p={8} textAlign={'center'} fontSize={['md', 'xl']}>You either master money, or on some level, money masters you!</Text>
                </Box>
                <Box className='serif'>
                    <Stack p={8} direction={['column', 'row']} w={'full'} justifyContent={'space-between'} gap={12}>
                        <Image w={['full', '4xl']} src='https://www.nationstrust.com/images/life-moments/easily-save-money-1.jpg' />
                        <Box>
                            <Text fontSize={['xl', '6xl']} textAlign={['center', 'right']}>
                                Thrive<br />Your<br />Income
                            </Text>
                            <Button p={2} w={['56']} mt={12} rounded={6} bgColor={'yellow.400'} fontSize={'lg'} fontWeight={'semibold'} color={'#333'}>Watch Video</Button>
                        </Box>
                    </Stack>
                    <Text p={8} textAlign={'center'} fontSize={['md', 'xl']}>You either master money, or on some level, money masters you!</Text>
                </Box>
                <Box className='serif'>
                    <Stack p={8} direction={['column', 'row']} w={'full'} justifyContent={'space-between'} gap={12}>
                        <Image w={['full', '4xl']} src='https://www.nationstrust.com/images/life-moments/easily-save-money-1.jpg' />
                        <Box>
                            <Text fontSize={['xl', '6xl']} textAlign={['center', 'right']}>
                                Thrive<br />Your<br />Income
                            </Text>
                            <Button p={2} w={['56']} mt={12} rounded={6} bgColor={'yellow.400'} fontSize={'lg'} fontWeight={'semibold'} color={'#333'}>Watch Video</Button>
                        </Box>
                    </Stack>
                    <Text p={8} textAlign={'center'} fontSize={['md', 'xl']}>You either master money, or on some level, money masters you!</Text>
                </Box>
            </Slider>
        </Box>
    );
};

export default Carousel;
