'use client'
import React from 'react';
import { Box, HStack, Spacer, Stack, Text, VStack, Image } from '@chakra-ui/react';
import { BsFacebook, BsInstagram, BsLinkedin, BsPhone, BsTelephone, BsTelephoneFill, BsTwitter } from 'react-icons/bs'
import { GrLocation } from 'react-icons/gr'

const Footer = () => {
  return (
    <Box p={[8, 16]} bgColor={'blanchedalmond'}>
      <Stack direction={['column', 'row']} alignItems={'flex-end'} justifyContent={'space-between'} gap={8}>
        <Box flex={1}>
          <Image src='/logo.png' w={20} />
          <Box>
            <br />
            <Text className='serif' pb={2} >Terms of Service</Text>
            <Text className='serif' pb={2} >Privacy Policy</Text>
            <Text className='serif' pb={2} >Refund Policy</Text>
          </Box>
        </Box>
        <Spacer />
        <Box>
        <HStack p={8}>
          <GrLocation color='#333' fontSize={36} />
          <Text fontSize={'lg'}>Space for Address</Text>
        </HStack>
        <HStack p={8}>
          <BsTelephoneFill color='#333' fontSize={36} />
          <Text fontSize={'lg'}>+91 90228 53554</Text>
        </HStack>
        <HStack p={8} spacing={8}>
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
