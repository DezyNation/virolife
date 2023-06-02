'use client'
import React from 'react'
import { Box, Image, Stack, Text } from '@chakra-ui/react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/blog.css'

const Post = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoPlay: true,
    };
    return (
        <>
            <Stack
                direction={['column', 'row']} minH={'100vh'}
                p={[8, 16, 24]} justifyContent={'space-between'}
                bgImage={'/blogbg.png'} bgSize={'cover'} bgRepeat={'no-repeat'}
                bgPos={['95% 80%', 'center']}
            >
                <Box w={['full', 'sm', 'xl']} p={4}>
                    <Image src='/blob.png' />
                </Box>
                <Box maxW={['full', 'xl']}>
                    <Slider {...settings}>
                        <Box>
                            <Text fontSize={['3xl', '5xl']} fontWeight={'bold'} color={'#666'}>Why Crowd Funding?</Text>
                            <Text fontSize={['xl', '2xl']} color={'#666'}>Expert Says</Text>
                            <br /> <br />
                            <Text
                                fontSize={['xl', '3xl']}
                                fontWeight={'semibold'}
                                color={'#666'}
                                textTransform={'capitalize'}
                            >promote your business on social media
                            </Text>
                            <br />
                            <Text textTransform={'uppercase'} color={'#444'} fontSize={['lg', 'xl']} fontWeight={'medium'}>
                                social media tips and strategies to grow your business online
                            </Text>
                        </Box>
                        <Box>
                            <Text
                                fontSize={['xl', '3xl']}
                                fontWeight={'semibold'}
                                color={'#666'}
                                textTransform={'capitalize'}
                            >promote your business on social media
                            </Text>
                            <br />
                            <Text textTransform={'uppercase'} color={'#444'} fontSize={['lg', 'xl']} fontWeight={'medium'}>
                                Connectivity: connectivity is among the most significant benefits of social media
                                <br /><br />
                                education: the use of education in social media is commendable
                            </Text>
                        </Box>
                    </Slider>
                </Box>
            </Stack>
        </>
    )
}

export default Post