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
    Stack
} from '@chakra-ui/react';

const Navbar = () => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <>
            <Box px={4} py={3}>
                <Flex w={['full']} alignItems="center" display={{ base: 'none', md: 'flex' }}>
                    <HStack spacing={8} fontWeight={'medium'}>
                        <Box cursor={'pointer'} mr={4} className='serif'>About Us</Box>
                        <Box cursor={'pointer'} mr={4} className='serif' onClick={onToggle}>Login/Signup</Box>
                    </HStack>
                    <Spacer />
                    <Box cursor={'pointer'}>
                        <Text fontSize={'lg'} className='serif' fontWeight={'bold'} color={'#666'}>Affiliate</Text>
                    </Box>
                    <Spacer />
                    <HStack spacing={8} fontWeight={'medium'}>
                        <Box cursor={'pointer'} mr={4} className='serif'>Blog</Box>
                        <Box cursor={'pointer'} mr={4} className='serif'>Buy Sell</Box>
                        <Box cursor={'pointer'} mr={4} className='serif'>Contact</Box>
                    </HStack>
                </Flex>
            </Box>

            <Modal
                isOpen={isOpen}
                isCentered={true}
                onClose={onToggle}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalBody p={12}>
                        <Stack>
                            <FormControl>
                                <HStack spacing={8}>
                                    <FormLabel fontSize={'xl'}>Email</FormLabel>
                                    <Input type='password' boxShadow={'xl'} border={'none'} rounded={0} />
                                </HStack>
                            </FormControl>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Navbar;
