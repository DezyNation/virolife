"use client"
import React, { useEffect, useState } from 'react';
import {
    Box,
    Text,
    Flex,
    Spacer,
    IconButton,
    Collapse,
    useDisclosure,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    FormControl,
    Input,
    FormLabel,
    Stack,
    VStack,
    Image,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerCloseButton,
    DrawerBody,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    useToast,
    InputGroup,
    InputRightElement
} from '@chakra-ui/react';
import Link from 'next/link';
import { BiMenuAltLeft } from 'react-icons/bi'
import { useSession, signIn, signOut } from "next-auth/react"
import { useFormik } from 'formik';
import BackendAxios from '@/utils/axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Cookies from 'js-cookie';
import { useJwt, decodeToken, isExpired } from 'react-jwt'
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Navbar = () => {
    const Toast = useToast({ position: 'top-right' })
    const { isOpen, onToggle } = useDisclosure();
    const [isSignupOpen, setIsSignupOpen] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [name, setName] = useState("")
    const [isPasswordVisible, setisPasswordVisible] = useState(false)
    const [sessionExpired, setSessionExpired] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies(['jwt'])

    const Formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        }
    })

    useEffect(() => {
        setSessionExpired(isExpired(cookies.jwt))
    }, [cookies])


    function handleLogin() {
        if (!Formik.values.email || !Formik.values.password) {
            Toast({
                description: 'Email and password must not be empty'
            })
            return
        }
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, { ...Formik.values }).then(res => {
            Toast({
                status: 'success',
                description: 'Login successful!'
            })
            BackendAxios.defaults.headers.common['Authorization'] = `Bearer ${res.data?.access_token}`
            // Cookies.set("jwt", res.data?.access_token)
            setCookie("jwt", res.data?.access_token)
            onToggle()
        }).catch(err => {
            Toast({
                status: 'error',
                description: err?.response?.data?.message || err?.response?.data || err?.message
            })
        })
    }

    function handleSignup() {
        if (!Formik.values.email || !Formik.values.password) {
            Toast({
                description: 'Email and password must not be empty'
            })
            return
        }
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, { ...Formik.values, name: name }).then(res => {
            Toast({
                status: 'success',
                description: 'Signup successful!'
            })
            setIsSignupOpen(false)
        }).catch(err => {
            Toast({
                status: 'error',
                description: err?.response?.data?.message || err?.response?.data || err?.message
            })
        })
    }

    return (
        <>
            <Box w={'full'} mx={'auto'} p={4} borderBottom={'1px'} borderBottomColor={'yellow.500'}>
                <Flex w={['full']} alignItems="center" display={{ base: 'none', md: 'flex' }}>
                    <HStack spacing={8} fontWeight={'medium'}>
                        <Image src='/logo.png' width={16} />
                        <Box cursor={'pointer'} fontSize={'lg'} mr={4} className='serif'>About Us</Box>
                        {
                            sessionExpired ?
                                <Box cursor={'pointer'} fontSize={'lg'} mr={4} className='serif' onClick={onToggle}>Login</Box>
                                : null
                        }
                        {
                            sessionExpired ?
                                <Box cursor={'pointer'} fontSize={'lg'} mr={4} className='serif' onClick={() => setIsSignupOpen(true)}>Signup</Box>
                                : null
                        }
                        {
                            !sessionExpired ?
                                <Link href={'/dashboard'}>
                                    <Box cursor={'pointer'} fontSize={'lg'} mr={4} className='serif'>Dashboard</Box>
                                </Link>
                                : null
                        }
                    </HStack>
                    <Spacer />
                    <Popover>
                        <PopoverTrigger>
                            <Text cursor={'pointer'} fontSize={'xl'} className='serif' fontWeight={'bold'} color={'#666'}>Group Funding</Text>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverBody>
                                <VStack gap={4}>
                                    <Link href={'/campaigns'} style={{ width: '100%' }}>
                                        <Box className='serif' fontSize={'lg'} p={2} _hover={{ bg: 'blanchedalmond' }}>Self Funding</Box>
                                    </Link>
                                    <Link href={'/campaigns'} style={{ width: '100%' }}>
                                        <Box className='serif' fontSize={'lg'} p={2} _hover={{ bg: 'blanchedalmond' }}>Group Funding</Box>
                                    </Link>
                                    <Link href={'/campaigns'} style={{ width: '100%' }}>
                                        <Box className='serif' fontSize={'lg'} p={2} _hover={{ bg: 'blanchedalmond' }}>Viro Team Funding</Box>
                                    </Link>
                                </VStack>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                    <Spacer />
                    <HStack spacing={8} fontWeight={'medium'}>
                        <Link href={'/blogs'}>
                            <Box cursor={'pointer'} mr={4} fontSize={'lg'} className='serif'>Blog</Box>
                        </Link>
                        <Box cursor={'pointer'} mr={4} fontSize={'lg'} className='serif'>Redeem Points</Box>
                        <Box cursor={'pointer'} mr={4} fontSize={'lg'} className='serif'>Contact</Box>
                    </HStack>
                </Flex>
                <Flex w={['full']} alignItems="center" display={{ base: 'flex', md: 'none' }}>
                    <BiMenuAltLeft size={24} onClick={() => setIsDrawerOpen(!isDrawerOpen)} />
                    <Spacer />
                    <Link href={'/'}>
                        <Box cursor={'pointer'}>
                            <Text fontSize={'lg'} className='serif' fontWeight={'bold'} color={'#666'}>Virolife</Text>
                        </Box>
                    </Link>
                </Flex>
            </Box>


            <Drawer
                size={'xs'}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                placement='left'
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>
                        <Image src='/logo.png' width={16} />
                        <DrawerCloseButton />
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack gap={4} p={4} w={'full'} alignItems={'flex-start'}>
                            <Text>Home</Text>
                            {/* {
                                status === "unauthenticated" ?
                                    <Text onClick={onToggle}>Login</Text>
                                    : null
                                } */}
                            <Text onClick={onToggle}>Login</Text>
                            {/* {
                                status === "unauthenticated" ?
                                    <Text onClick={() => setIsSignupOpen(true)}>Signup</Text>
                                    : null
                            } */}
                            <Text onClick={() => setIsSignupOpen(true)}>Signup</Text>
                            {/* {
                                status === "authenticated" ?
                                    <Link href={'/dashboard'}>
                                        <Text>Dashboard</Text>
                                    </Link>
                                    : null
                            } */}
                            <Accordion w={'full'} allowToggle>
                                <AccordionItem border={'none'}>
                                    <AccordionButton px={0} justifyContent={'space-between'}>
                                        <Text className='serif'>Group Funding</Text>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    <AccordionPanel>
                                        <VStack gap={2}>
                                            <Link href={'/campaigns'} style={{ width: '100%' }}>
                                                <Text className='serif' p={2} _hover={{ bg: 'blanchedalmond' }}>Self Funding</Text>
                                            </Link>
                                            <Link href={'/campaigns'} style={{ width: '100%' }}>
                                                <Text className='serif' p={2} _hover={{ bg: 'blanchedalmond' }}>Group Funding</Text>
                                            </Link>
                                            <Link href={'/campaigns'} style={{ width: '100%' }}>
                                                <Text className='serif' p={2} _hover={{ bg: 'blanchedalmond' }}>Viro Team Funding</Text>
                                            </Link>
                                        </VStack>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                            <Link href={'/blogs'}>
                                <Text>Blog</Text>
                            </Link>
                            <Text>Redeem Points</Text>
                            <Text>Contact Us</Text>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* Login Popup */}
            <Modal
                isOpen={isOpen}
                isCentered={true}
                onClose={onToggle}
                size={'4xl'}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalBody p={12}>
                        <Stack direction={['column', 'row']} gap={8}>
                            <VStack gap={8}>
                                <FormControl>
                                    <Stack direction={['column', 'row']} spacing={8} justifyContent={'space-between'}>
                                        <FormLabel fontSize={'xl'}>Email</FormLabel>
                                        <Input
                                            w={['full', 'xs']}
                                            placeholder='Your Email'
                                            type='email'
                                            boxShadow={'xl'}
                                            border={'.5px solid #FAFAFA'}
                                            rounded={0}
                                            name='email'
                                            onChange={Formik.handleChange}
                                        />
                                    </Stack>
                                </FormControl>
                                <FormControl>
                                    <Stack direction={['column', 'row']} spacing={8}>
                                        <FormLabel fontSize={'xl'}>Password</FormLabel>
                                        <InputGroup>
                                            <Input
                                                w={['full', 'xs']}
                                                placeholder='Password'
                                                type={isPasswordVisible ? 'text' : 'password'}
                                                boxShadow={'xl'}
                                                border={'.5px solid #FAFAFA'}
                                                rounded={0}
                                                name='password'
                                                onChange={Formik.handleChange}
                                            />
                                            <InputRightElement
                                                children={isPasswordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                                onClick={() => setisPasswordVisible(!isPasswordVisible)}
                                            />
                                        </InputGroup>
                                    </Stack>
                                </FormControl>
                                <HStack>
                                    <Button colorScheme='yellow' variant={'outline'} onClick={onToggle}>Cancel</Button>
                                    <Button colorScheme='yellow' onClick={handleLogin}>Continue</Button>
                                </HStack>
                            </VStack>
                            <VStack w={['full', 'xs']} gap={8}>
                                <Text textAlign={'center'}>Or Login With</Text>
                                <Image src='/gmail.png' w={20} cursor={'pointer'} onClick={() => signIn("google")} />
                            </VStack>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Signup Popup */}
            <Modal
                isOpen={isSignupOpen}
                isCentered={true}
                onClose={() => setIsSignupOpen(!isSignupOpen)}
                size={'4xl'}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalBody p={[8, 12]}>
                        <Stack direction={['column', 'row']} gap={[4, 8]}>
                            <VStack gap={8}>
                                <FormControl>
                                    <Stack direction={['column', 'row']} spacing={[4, 8]} justifyContent={'space-between'}>
                                        <FormLabel fontSize={'xl'}>Name</FormLabel>
                                        <Input
                                            w={['full', 'xs']}
                                            placeholder='Your Full Name'
                                            boxShadow={'xl'}
                                            border={'.5px solid #FAFAFA'}
                                            rounded={0}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </Stack>
                                </FormControl>
                                <FormControl>
                                    <Stack direction={['column', 'row']} spacing={[4, 8]} justifyContent={'space-between'}>
                                        <FormLabel fontSize={'xl'}>Email</FormLabel>
                                        <Input
                                            w={['full', 'xs']}
                                            placeholder='Your Email'
                                            type='email'
                                            name='email'
                                            onChange={Formik.handleChange}
                                            boxShadow={'xl'}
                                            border={'.5px solid #FAFAFA'}
                                            rounded={0}
                                        />
                                    </Stack>
                                </FormControl>
                                <FormControl>
                                    <Stack direction={['column', 'row']} spacing={[4, 8]}>
                                        <FormLabel fontSize={'xl'}>Password</FormLabel>
                                        <InputGroup>
                                            <Input
                                                w={['full', 'xs']}
                                                placeholder='Password'
                                                type={isPasswordVisible ? 'text' : 'password'}
                                                boxShadow={'xl'}
                                                border={'.5px solid #FAFAFA'}
                                                rounded={0}
                                                name='password'
                                                onChange={Formik.handleChange}
                                            />
                                            <InputRightElement
                                                children={isPasswordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                                onClick={() => setisPasswordVisible(!isPasswordVisible)}
                                            />
                                        </InputGroup>
                                    </Stack>
                                </FormControl>
                                <HStack>
                                    <Button colorScheme='yellow' variant={'outline'} onClick={() => setIsSignupOpen(!isSignupOpen)}>Cancel</Button>
                                    <Button colorScheme='yellow' onClick={handleSignup}>Continue</Button>
                                </HStack>
                            </VStack>
                            <VStack w={['full', 'xs']} gap={8}>
                                <Text textAlign={'center'}>Or Register With</Text>
                                <Image src='/gmail.png' w={20} cursor={'pointer'} onClick={() => signIn("google")} />
                            </VStack>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>

        </>
    );
};

export default Navbar;
