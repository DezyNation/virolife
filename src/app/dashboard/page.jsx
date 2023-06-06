'use client'
import React, { useState } from 'react'
import {
    Text,
    Stack,
    Box,
    Image,
    Button,
    HStack,
    VStack
} from '@chakra-ui/react'
import StatsCard from '@/components/dashboard/StatsCard'
import { BsArrowRight, BsCashCoin, BsCurrencyRupee, BsMegaphoneFill, BsYoutube } from 'react-icons/bs'
import Link from 'next/link'
import { useSession, signIn, signOut } from "next-auth/react"

const DashboardHome = () => {
    const { data: session } = useSession()
    const [selectedImg, setSelectedImg] = useState("https://t3.ftcdn.net/jpg/04/19/34/24/360_F_419342418_pBHSf17ZBQn77E7z3OWcXrWfCuxZkc3Q.jpg")
    if(!session){
        return(
            <>
                <Text>You need to login to view this page</Text>
            </>
        )
    }
    return (
        <>
            <Text className='serif' fontSize={'xl'} py={4} textTransform={'capitalize'}>Welcome, {session.user.name}</Text>
            <Stack w={'full'} direction={['column', 'row']} gap={[8, 16]} justifyContent={'space-between'}>
                <StatsCard
                    icon={<BsYoutube size={28} />}
                    title={'videos watched'}
                />
                <StatsCard
                    icon={<BsMegaphoneFill size={28} />}
                    title={'active campaigns'}
                />
                <StatsCard
                    icon={<BsCurrencyRupee size={28} />}
                    title={'funds collected'}
                />
                <StatsCard
                    icon={<BsCashCoin size={28} />}
                    title={'amount settled'}
                />
            </Stack>
            <Box pt={16}>
                <Stack direction={['column', 'row']} gap={8} justifyContent={'space-between'}>
                    <Box flex={['unset', 4]}>
                        <Text pb={8}>Your Most Recent Campaign</Text>
                        <Box
                            pos={'relative'}
                            boxShadow={'md'}
                            rounded={8}
                            overflow={'hidden'}
                            bgImage={selectedImg}
                            bgSize={'cover'}
                            bgRepeat={'no-repeat'}
                            h={'sm'}
                            cursor={'pointer'}
                        >
                            <Box
                                position={'absolute'} w={'full'} h={'sm'}
                                top={0} left={0} right={0} bottom={0} p={4}
                                bgImage={'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.3))'}
                                display={'flex'} flexDirection={'column'}
                                alignItems={'flex-start'} justifyContent={'flex-end'}
                            >
                                <Text pos={'absolute'} top={4} right={4} color={'#FFF'}>03 June 2023</Text>
                                <Text className='serif' fontSize={'3xl'} color={'#FFF'}>Save Our Cows</Text>
                                <Text fontSize={'xs'} color={'#FFF'}>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, omnis fuga?
                                    Exercitationem laudantium pariatur ducimus molestias eum deleniti est tempore!
                                    Ex ad atque maxime a. Incidunt, unde iure.
                                </Text>
                            </Box>
                        </Box>
                        <Link href={'/dashboard/campaigns'}>
                            <Button mt={8} colorScheme='yellow' rightIcon={<BsArrowRight />}>
                                View All Campaigns
                            </Button>
                        </Link>
                    </Box>
                    <Box flex={['unset', 2]}>
                        <Text pb={8}>Your Top Contributors</Text>
                        <VStack gap={4} w={'full'} p={4} boxShadow={'md'} rounded={8}>
                            <Box w={'full'} p={2} borderBottom={'1px'} borderColor={'#DDD'}>
                                <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                                    <Box>
                                        <Text className='serif'>Sangam Kumar</Text>
                                        <Text fontSize={'xs'} color={'#AAA'}>for Save The Cows</Text>
                                    </Box>
                                    <Text fontSize={'sm'} fontWeight={'semibold'}>₹4571</Text>
                                </HStack>
                            </Box>
                            <Box w={'full'} p={2} borderBottom={'1px'} borderColor={'#DDD'}>
                                <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                                    <Box>
                                        <Text className='serif'>John Doe</Text>
                                        <Text fontSize={'xs'} color={'#AAA'}>for Save The Cows</Text>
                                    </Box>
                                    <Text fontSize={'sm'} fontWeight={'semibold'}>₹3654</Text>
                                </HStack>
                            </Box>
                            <Box w={'full'} p={2} borderBottom={'1px'} borderColor={'#DDD'}>
                                <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                                    <Box>
                                        <Text className='serif'>Sanjay Mehta</Text>
                                        <Text fontSize={'xs'} color={'#AAA'}>for Save The Cows</Text>
                                    </Box>
                                    <Text fontSize={'sm'} fontWeight={'semibold'}>₹3600</Text>
                                </HStack>
                            </Box>
                            <Box w={'full'} p={2} borderBottom={'1px'} borderColor={'#DDD'}>
                                <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                                    <Box>
                                        <Text className='serif'>George Bush</Text>
                                        <Text fontSize={'xs'} color={'#AAA'}>for Save The Cows</Text>
                                    </Box>
                                    <Text fontSize={'sm'} fontWeight={'semibold'}>₹2154</Text>
                                </HStack>
                            </Box>
                            <Box w={'full'} p={2} borderBottom={'1px'} borderColor={'#DDD'}>
                                <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                                    <Box>
                                        <Text className='serif'>Tilak Prasad</Text>
                                        <Text fontSize={'xs'} color={'#AAA'}>for Save The Cows</Text>
                                    </Box>
                                    <Text fontSize={'sm'} fontWeight={'semibold'}>₹3884</Text>
                                </HStack>
                            </Box>
                            <Button pt={4} w={'full'} variant={'link'} colorScheme='yellow'>
                                View All Contributors
                            </Button>
                        </VStack>
                    </Box>
                </Stack>
            </Box>
        </>
    )
}

export default DashboardHome