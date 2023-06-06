'use client'
import React from 'react';
import { Box, HStack, Image, Spacer, Stack, Text, VStack } from '@chakra-ui/react';
import { BsFacebook, BsInstagram, BsLinkedin, BsTelephoneFill, BsTwitter } from 'react-icons/bs'
import { GrLocation } from 'react-icons/gr'

const Footer = () => {
  return (
    <Box w={'full'} p={4} bgColor={'blanchedalmond'}>
      <Stack direction={['column', 'row']} gap={8}>
        <Box w={'full'} flex={1}>
          <Image src='/logo.png' width={24} />
        </Box>
        <Spacer />
        <VStack w={'full'} alignItems={'flex-start'} justifyContent={'flex-start'} gap={2} flex={1}>
          <Text fontSize={'lg'} className='serif' fontWeight={'semibold'}>Services</Text>
            <Text fontWeight={'normal'}>Raise Funds</Text>
            <Text fontWeight={'normal'}>Investment Opportunities</Text>
            <Text fontWeight={'normal'}>Payment Process</Text>
        </VStack>
        <Spacer />
        <VStack w={'full'} alignItems={'flex-start'} justifyContent={'flex-start'} gap={2} flex={1}>
          <Text fontSize={'lg'} className='serif' fontWeight={'semibold'}>Important</Text>
          <Text fontWeight={'normal'}>Terms & Conditions</Text>
          <Text fontWeight={'normal'}>Privacy Policy</Text>
          <Text fontWeight={'normal'}>Refund Policy</Text>
        </VStack>
        <Spacer />
        <Box flex={1} w={'full'}>
          <HStack p={8} py={2}>
            <GrLocation color='#333' fontSize={36} />
            <Text fontSize={'lg'}>Space for Address</Text>
          </HStack>
          <HStack p={8} py={2}>
            <BsTelephoneFill color='#333' fontSize={36} />
            <Text fontSize={'lg'}>+91 90228 53554</Text>
          </HStack>
          <HStack p={8} py={2} spacing={8}>
            <BsFacebook color='#333' fontSize={36} cursor={'pointer'} />
            <BsInstagram color='#333' fontSize={36} cursor={'pointer'} />
            <BsTwitter color='#333' fontSize={36} cursor={'pointer'} />
            <BsLinkedin color='#333' fontSize={36} cursor={'pointer'} />
          </HStack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Footer;
