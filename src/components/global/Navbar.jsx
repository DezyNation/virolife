"use client"
import React, { useState } from 'react';
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
    Image
} from '@chakra-ui/react';
import Link from 'next/link';

const Navbar = () => {
    const { isOpen, onToggle } = useDisclosure();
    const [isSignupOpen, setIsSignupOpen] = useState(false)
    return (
        <>
            <Box w={'98%'} mx={'auto'} p={4} borderBottom={'1px'} borderBottomColor={'yellow.500'}>
                <Flex w={['full']} alignItems="center" display={{ base: 'none', md: 'flex' }}>
                    <HStack spacing={8} fontWeight={'medium'}>
                        <Box cursor={'pointer'} mr={4} className='serif'>About Us</Box>
                        <Box cursor={'pointer'} mr={4} className='serif' onClick={onToggle}>Login</Box>
                        <Box cursor={'pointer'} mr={4} className='serif' onClick={() => setIsSignupOpen(true)}>Signup</Box>
                    </HStack>
                    <Spacer />
                    <Link href={'/auth/info'}>
                        <Box cursor={'pointer'}>
                            <Text fontSize={'lg'} className='serif' fontWeight={'bold'} color={'#666'}>Affiliate</Text>
                        </Box>
                    </Link>
                    <Spacer />
                    <HStack spacing={8} fontWeight={'medium'}>
                        <Box cursor={'pointer'} mr={4} className='serif'>Blog</Box>
                        <Box cursor={'pointer'} mr={4} className='serif'>Buy Sell</Box>
                        <Box cursor={'pointer'} mr={4} className='serif'>Contact</Box>
                    </HStack>
                </Flex>
            </Box>


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
                                        <Input w={['full', 'xs']} placeholder='Your Email' type='email' boxShadow={'xl'} border={'.5px solid #FAFAFA'} rounded={0} />
                                    </Stack>
                                </FormControl>
                                <FormControl>
                                    <Stack direction={['column', 'row']} spacing={8}>
                                        <FormLabel fontSize={'xl'}>Password</FormLabel>
                                        <Input w={['full', 'xs']} placeholder='Password' type='password' boxShadow={'xl'} border={'.5px solid #FAFAFA'} rounded={0} />
                                    </Stack>
                                </FormControl>
                                <Button colorScheme='yellow'>Continue</Button>
                            </VStack>
                            <VStack w={['full', 'xs']} gap={8}>
                                <Text textAlign={'center'}>Or Login With</Text>
                                <Image src='/gmail.png' w={20} cursor={'pointer'} />
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
                    <ModalBody p={12}>
                        <Stack direction={['column', 'row']} gap={8}>
                            <VStack gap={8}>
                                <FormControl>
                                    <Stack direction={['column', 'row']} spacing={8} justifyContent={'space-between'}>
                                        <FormLabel fontSize={'xl'}>Name</FormLabel>
                                        <Input w={['full', 'xs']} placeholder='Your Full Name' boxShadow={'xl'} border={'.5px solid #FAFAFA'} rounded={0} />
                                    </Stack>
                                </FormControl>
                                <FormControl>
                                    <Stack direction={['column', 'row']} spacing={8} justifyContent={'space-between'}>
                                        <FormLabel fontSize={'xl'}>Email</FormLabel>
                                        <Input w={['full', 'xs']} placeholder='Your Email' type='email' boxShadow={'xl'} border={'.5px solid #FAFAFA'} rounded={0} />
                                    </Stack>
                                </FormControl>
                                <FormControl>
                                    <Stack direction={['column', 'row']} spacing={8}>
                                        <FormLabel fontSize={'xl'}>Password</FormLabel>
                                        <Input w={['full', 'xs']} placeholder='Password' type='password' boxShadow={'xl'} border={'.5px solid #FAFAFA'} rounded={0} />
                                    </Stack>
                                </FormControl>
                                <Button colorScheme='yellow'>Continue</Button>
                            </VStack>
                            <VStack w={['full', 'xs']} gap={8}>
                                <Text textAlign={'center'}>Or Register With</Text>
                                <Image src='/gmail.png' w={20} cursor={'pointer'} />
                            </VStack>
                        </Stack>
                    </ModalBody>
                </ModalContent>

            </Modal>
        </>
    );
};

export default Navbar;
