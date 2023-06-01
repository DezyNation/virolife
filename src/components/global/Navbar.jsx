"use client"
import React, { useState } from 'react';
import { Box, Text, Flex, Spacer, IconButton, Collapse, useDisclosure, HStack } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const Navbar = () => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Box className='serif' px={4} py={3}>
            <Flex alignItems="center">
                <IconButton
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    variant="ghost"
                    colorScheme="white"
                    onClick={onToggle}
                    display={{ base: 'block', md: 'none' }}
                />
                <Box>
                    <Collapse in={isOpen} animateOpacity>
                        <Flex direction="column" mt={4} align="center">
                            <Box>Link 1</Box>
                            <Box>Link 2</Box>
                            <Box>Link 3</Box>
                        </Flex>
                    </Collapse>
                </Box>

                <Flex w={['full']} alignItems="center" display={{ base: 'none', md: 'flex' }}>
                    <HStack spacing={8} fontWeight={'medium'}>
                        <Box mr={4}>About Us</Box>
                        <Box mr={4}>Login/Signup</Box>
                    </HStack>
                    <Spacer />
                    <Box>
                        <Text fontSize={'lg'} fontWeight={'bold'} color={'#666'}>Affiliate</Text>
                    </Box>
                    <Spacer />
                    <HStack spacing={8} fontWeight={'medium'}>
                        <Box mr={4}>Blog</Box>
                        <Box mr={4}>Buy Sell</Box>
                        <Box mr={4}>Contact</Box>
                    </HStack>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Navbar;
