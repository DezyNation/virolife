'use client'
import React, { useEffect } from 'react'
import {
    Stack,
    Box,
    Text,
    Show,
    VStack,
    HStack
} from '@chakra-ui/react'
import Link from 'next/link'
import {
    AiFillDashboard,
    AiFillYoutube
} from 'react-icons/ai'
import { BsCashCoin, BsCurrencyRupee, BsFill1CircleFill, BsHeartFill, BsMegaphoneFill, BsPerson, BsPersonFill, BsPower } from 'react-icons/bs';
import { MdGroups } from 'react-icons/md';
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'


const Layout = ({ children }) => {
    const Router = useRouter()
    const { status } = useSession()
    useEffect(()=>{
        if(status==="unauthenticated"){
            Router.replace("/")
        }
    },[status])

    return (
        <>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Show above='md'>
                    <Box p={4} bg={'blanchedalmond'} w={'xs'}>
                        <Text className='serif' fontSize={'xl'} fontWeight={'semibold'}>Virolife</Text>
                        <VStack w={'full'} gap={4} pt={8} alignItems={'flex-start'}>
                            <Link href={'/auth/info'}>
                                <HStack gap={4}>
                                    <BsPersonFill size={20} />
                                    <Text>Profile</Text>
                                </HStack>
                            </Link>
                            <Link href={'/dashboard'}>
                                <HStack gap={4}>
                                    <AiFillDashboard size={20} />
                                    <Text>Dashboard</Text>
                                </HStack>
                            </Link>
                            <Link href={'/dashboard/videos'}>
                                <HStack gap={4}>
                                    <AiFillYoutube size={20} />
                                    <Text>Watch Videos</Text>
                                    <BsFill1CircleFill size={12} />
                                </HStack>
                            </Link>
                            <Link href={'/dashboard/campaigns'}>
                                <HStack gap={4}>
                                    <BsMegaphoneFill size={20} />
                                    <Text>My Campaigns</Text>
                                </HStack>
                            </Link>
                            <br />
                            <Link href={'/dashboard'}>
                                <HStack gap={4}>
                                    <BsCurrencyRupee size={20} />
                                    <Text>Collection</Text>
                                </HStack>
                            </Link>
                            <Link href={'/dashboard'}>
                                <HStack gap={4}>
                                    <BsCashCoin size={20} />
                                    <Text>Withdrawals</Text>
                                </HStack>
                            </Link>
                            <Link href={'/dashboard'}>
                                <HStack gap={4}>
                                    <MdGroups size={20} />
                                    <Text>Groups</Text>
                                </HStack>
                            </Link>
                            <br />
                            <Link href={'/dashboard'}>
                                <HStack gap={4}>
                                    <BsHeartFill size={20} />
                                    <Text>Support</Text>
                                </HStack>
                            </Link>
                            <HStack gap={4} onClick={signOut}>
                                <BsPower size={20} />
                                <Text>Log Out</Text>
                            </HStack>
                        </VStack>
                    </Box>
                </Show>
                <Box p={[4, 8, 8]} w={'full'} height={'100vh'} overflowY={'scroll'}>
                    {children}
                </Box>
            </Stack>
        </>
    )
}

export default Layout