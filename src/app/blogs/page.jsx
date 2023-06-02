'use client'
import React from 'react'
import { Box, Image, Stack, Text } from '@chakra-ui/react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from 'next/link';

const Index = () => {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        autoPlay: true,
        prevArrow: null,
        nextArrow: null,
        responsive: [
            {
                breakpoint: 1920, // screen width up to 1024px
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1024, // screen width up to 1024px
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768, // screen width up to 768px
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480, // screen width up to 480px
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };
    return (
        <>
            <Stack
                p={[8, 16, 24]} gap={12}
                direction={['column-reverse', 'row']}
                justifyContent={'space-between'}
            >
                <Box p={[4, 8]} bg={'blanchedalmond'} rounded={8} w={['full', 'sm']}>
                    <Text fontSize={['2xl', '4xl']}>
                        This can give you the <b>opportunity</b> to build new connections for <b>FUTURE</b> collaborations
                    </Text>
                </Box>
                <Image
                    src={'https://media-cldnry.s-nbcnews.com/image/upload/newscms/2018_12/1956916/170406-spring-savings-mn-1435.jpg'}
                    w={['full', 'sm']} rounded={8} objectFit={'cover'} />
            </Stack>
            <Box w={'full'} p={8}></Box>

            <Box p={8} my={12} bg={'#444'}>
                <Slider {...settings}>
                    <Link href={'/blogs/why-crowd-funding'}>
                        <Image
                            paddingX={['0', '8', '0']}
                            boxSize={'xs'}
                            rounded={64}
                            objectFit={'cover'}
                            src='https://www.bankofbaroda.in/-/media/project/bob/countrywebsites/india/blogs/savings/images/saving-vs-investing.jpg'
                        />
                    </Link>
                    <Link href={'/blogs/why-crowd-funding'}>
                        <Image
                            paddingX={['0', '8', '0']}
                            boxSize={'xs'}
                            rounded={64}
                            objectFit={'cover'}
                            src='https://www.righthorizons.com/wp-content/uploads/2022/06/Investing-globally-options-for-Indian-residents.jpg'
                        />
                    </Link>
                    <Link href={'/blogs/why-crowd-funding'}>
                        <Image
                            paddingX={['0', '8', '0']}
                            boxSize={'xs'}
                            rounded={64}
                            objectFit={'cover'}
                            src='https://www.valueresearchonline.com/content-assets/images/51119_20220802-investing__w660__.jpg'
                        />
                    </Link>
                </Slider>
            </Box>

            <Box p={8} my={12} bg={'#444'}>
                <Slider {...settings}>
                    <Link href={'/blogs/why-crowd-funding'}>
                        <Image
                            paddingX={['0', '8', '0']}
                            boxSize={'xs'}
                            rounded={64}
                            objectFit={'cover'}
                            src='https://www.bankofbaroda.in/-/media/project/bob/countrywebsites/india/blogs/savings/images/saving-vs-investing.jpg'
                        />
                    </Link>
                    <Link href={'/blogs/why-crowd-funding'}>
                        <Image
                            paddingX={['0', '8', '0']}
                            boxSize={'xs'}
                            rounded={64}
                            objectFit={'cover'}
                            src='https://www.righthorizons.com/wp-content/uploads/2022/06/Investing-globally-options-for-Indian-residents.jpg'
                        />
                    </Link>
                    <Link href={'/blogs/why-crowd-funding'}>
                        <Image
                            paddingX={['0', '8', '0']}
                            boxSize={'xs'}
                            rounded={64}
                            objectFit={'cover'}
                            src='https://www.valueresearchonline.com/content-assets/images/51119_20220802-investing__w660__.jpg'
                        />
                    </Link>
                </Slider>
            </Box>
        </>
    )
}

export default Index