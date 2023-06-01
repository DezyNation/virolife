'use client'
import React, { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
  VStack,

} from '@chakra-ui/react'
import { BsArrowRight } from 'react-icons/bs'

const Info = () => {
  const [gender, setGender] = useState("male")

  return (
    <>
      <Box p={8}>
        <Stack w={'full'} pb={16} gap={8} direction={['column', 'row']} justifyContent={'space-between'}>
          <FormControl>
            <Box>
              <FormLabel fontWeight={'bold'} textTransform={'uppercase'} fontSize={'lg'}>FIRST NAME</FormLabel>
              <Input bg={'blanchedalmond'} w={['full', 'xs']} />
            </Box>
          </FormControl>
          <FormControl>
            <Box>
              <FormLabel fontWeight={'bold'} textTransform={'uppercase'} fontSize={'lg'}>MIDDLE NAME</FormLabel>
              <Input bg={'blanchedalmond'} w={['full', 'xs']} />
            </Box>
          </FormControl>
          <FormControl>
            <Box>
              <FormLabel fontWeight={'bold'} textTransform={'uppercase'} fontSize={'lg'}>LAST NAME</FormLabel>
              <Input bg={'blanchedalmond'} w={['full', 'xs']} />
            </Box>
          </FormControl>
        </Stack>
        <Stack pb={16} gap={[8, 48]} direction={['column', 'row']} justifyContent={'flex-start'}>
          <HStack gap={4}>
            <FormLabel fontWeight={'bold'} textTransform={'uppercase'} fontSize={'lg'}>GENDER</FormLabel>
            <Button rounded={'full'} colorScheme='yellow' onClick={() => setGender("male")} variant={gender == "male" ? 'solid' : 'outline'}>M</Button>
            <Button rounded={'full'} colorScheme='yellow' onClick={() => setGender("female")} variant={gender == "female" ? 'solid' : 'outline'}>F</Button>
            <Button rounded={'full'} colorScheme='yellow' onClick={() => setGender("others")} variant={gender == "others" ? 'solid' : 'outline'}>O</Button>
          </HStack>
          <HStack gap={4}>
            <FormLabel fontWeight={'bold'} textTransform={'uppercase'} fontSize={'lg'}>date of birth</FormLabel>
            <Input bg={'blanchedalmond'} w={['full', 'xs']} type='date' />
          </HStack>
        </Stack>
        <Stack w={'full'} gap={8} pb={16} direction={['column', 'row']} justifyContent={'space-between'}>
          <FormControl>
            <FormLabel fontWeight={'bold'} textTransform={'uppercase'} fontSize={'lg'}>CONTACT NO</FormLabel>
            <HStack>
              <Input bg={'blanchedalmond'} w={['full', 'xs']} />
              <Text>Verify</Text>
            </HStack>
          </FormControl>
          <FormControl>
            <FormLabel fontWeight={'bold'} textTransform={'uppercase'} fontSize={'lg'}>EMAIL ID</FormLabel>
            <HStack>
              <Input bg={'blanchedalmond'} w={['full', 'xs']} />
              <Text>Verify</Text>
            </HStack>
          </FormControl>
        </Stack>
        <Stack w={'full'} pb={16} direction={['column', 'row']} justifyContent={'space-between'}>
          <FormControl>
            <FormLabel fontWeight={'bold'} textTransform={'uppercase'} fontSize={'lg'}>UPLOAD PDF</FormLabel>
            <HStack>
              <Input type='file' bg={'blanchedalmond'} w={['full', 'xs']} />
              <Input type='file' bg={'blanchedalmond'} w={['full', 'xs']} />
            </HStack>
          </FormControl>
        </Stack>
        <HStack>
          <Checkbox />
          <Text>I have read and accept the Terms & Conditions and Privacy Policy of Virolife Foundation With All My Attention</Text>
        </HStack>
        <HStack justifyContent={'flex-end'}>
          <Button rightIcon={<BsArrowRight />} colorScheme='yellow'>Proceed</Button>
        </HStack>
      </Box>
    </>
  )
}

export default Info