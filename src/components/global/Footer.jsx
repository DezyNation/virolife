'use client'
import React from 'react';
import { Box, HStack, Spacer, Stack, Text, VStack } from '@chakra-ui/react';
import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from 'react-icons/bs'

const Footer = () => {
  return (
    <VStack p={8} bgColor={'blanchedalmond'}>
      <Stack direction={['column', 'row']} gap={8}>
        <Box flex={1}>
          <Text fontSize={'lg'} fontWeight={'semibold'}>Virolife</Text>
          <Text className='serif'>
            Our mission is to create opportunities for individuals to access the financial resources they need,
            fostering a community that believes in the power of collective support.
            Join us today and be a part of the positive change, as we work together to make dreams come true.
          </Text>
        </Box>
        <Spacer />
        <Box flex={1}>
          <Text fontSize={'lg'} className='serif' fontWeight={'semibold'}>Services</Text>
          <Text fontWeight={'normal'}>Raise Funds</Text>
          <Text fontWeight={'normal'}>Investment Opportunities</Text>
          <Text fontWeight={'normal'}>Payment Process</Text>
        </Box>
        <Box flex={1}>
          <Text fontSize={'lg'} className='serif' fontWeight={'semibold'}>Important</Text>
          <Text fontWeight={'normal'}>Terms & Conditions</Text>
          <Text fontWeight={'normal'}>Privacy Policy</Text>
          <Text fontWeight={'normal'}>Refund Policy</Text>
        </Box>
      </Stack>
      <HStack p={8} spacing={8}>
        <BsFacebook color='#FEA1A1' fontSize={24} cursor={'pointer'} />
        <BsInstagram color='#FEA1A1' fontSize={24} cursor={'pointer'} />
        <BsTwitter color='#FEA1A1' fontSize={24} cursor={'pointer'} />
        <BsLinkedin color='#FEA1A1' fontSize={24} cursor={'pointer'} />
      </HStack>
      <Text p={2}>&copy; Copyright 2023 - Virolife. All Rights Reserved.</Text>
    </VStack>
  );
};

export default Footer;
