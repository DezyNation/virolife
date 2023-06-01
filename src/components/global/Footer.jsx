'use client'
import React from 'react';
import { Box, Flex, Text, VStack } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="gray.200" py={4}>
      <Flex align="center" justify="center" direction={{ base: 'column', md: 'row' }}>
        <Flex flex={1} justify="center" textAlign={{ base: 'center', md: 'left' }} mr={{ base: 0, md: 4 }}>
          <VStack className='serif' alignItems={'flex-start'} maxW={'xs'}>
            <Text fontSize={'xl'} fontWeight={'semibold'}>Virolife</Text>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci animi tempora voluptatem. Maiores aliquam laborum adipisci ad beatae voluptates eum.
            </Text>
          </VStack>
        </Flex>
        <Flex flex={1} justify="center" textAlign={{ base: 'center', md: 'center' }} mr={{ base: 0, md: 4 }}>
        <VStack className='serif' alignItems={'flex-start'}>
            <Text fontSize={'xl'} fontWeight={'semibold'}>Important Links</Text>
            <Text>Terms & Conditions</Text>
            <Text>Privacy Policy</Text>
            <Text>Refund Policy</Text>
          </VStack>
        </Flex>
        <Flex flex={1} justify="center" textAlign={{ base: 'center', md: 'right' }} mr={{ base: 0, md: 4 }}>
        <VStack className='serif' alignItems={'flex-start'}>
            <Text fontSize={'xl'} fontWeight={'semibold'}>Important Links</Text>
            <Text>Terms & Conditions</Text>
            <Text>Privacy Policy</Text>
            <Text>Refund Policy</Text>
          </VStack>
        </Flex>
      </Flex>
      <Flex mt={4} justify="center" gap={16} pt={8}>
        <Text mx={2} fontWeight={'semibold'}>Privacy Policy</Text>
        <Text mx={2} fontWeight={'semibold'}>Terms of Service</Text>
        <Text mx={2} fontWeight={'semibold'}>Contact Us</Text>
      </Flex>
      <Flex mt={4} justify="center">
        <Text>&copy; 2023 Your Company. All rights reserved.</Text>
      </Flex>
    </Box>
  );
};

export default Footer;
