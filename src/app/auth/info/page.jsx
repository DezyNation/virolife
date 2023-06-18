'use client'
import React, { useState, useEffect } from 'react'
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
  useToast,

} from '@chakra-ui/react'
import { BsArrowRight } from 'react-icons/bs'
import { useFormik } from 'formik'
import { useCookies } from 'react-cookie'
import { isExpired } from 'react-jwt'
import BackendAxios, { FormAxios } from '@/utils/axios'

const Info = () => {
  const Toast = useToast({ position: 'top-right' })
  const [gender, setGender] = useState("")
  const [authUser, setAuthUser] = useState({})

  const [cookies] = useCookies(['jwt'])

  const Formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      gender: gender,
      dob: "",
      phone: "",
      email: "",
      attachment1: null,
      attachment2: null
    },
    onSubmit: values => {
      FormAxios.post(`/update-user`, {
        ...values,
        name: values.firstName + (values.middleName && values.lastName ? ` ${values.middleName} ${values.lastName}` : !values.middleName && values.lastName && ` ${values.lastName}`)
      }).then(res => {
        Toast({
          status: 'success',
          description: "Data updated successfully!"
        })
      }).catch(err => {
        Toast({
          status: 'error',
          description: err?.response?.data?.message || err?.response?.data || err?.message
        })
      })
    }
  })

  useEffect(() => {
    if (!isExpired(cookies.jwt)) {
      BackendAxios.post("/auth-user").then(res => {
        setAuthUser(res.data)
        Formik.setFieldValue("firstName", res.data?.name?.split(" ")[0])
        if (res.data?.name?.split(" ")?.length >= 3) Formik.setFieldValue("middleName", res.data?.name?.split(" ")[1])
        if (res.data?.name?.split(" ")?.length >= 3) Formik.setFieldValue("lastName", res.data?.name?.split(" ")[2])
        if (res.data?.name?.split(" ")?.length >= 2) Formik.setFieldValue("lastName", res.data?.name?.split(" ")[1])
        Formik.setFieldValue("dob", res.data?.dob)
        Formik.setFieldValue("gender", res.data?.gender)
        Formik.setFieldValue("phone", res.data?.phone_number)
        Formik.setFieldValue("email", res.data?.email)
      }).catch(err => {
        Toast({
          status: 'error',
          description: err?.response?.data?.message || err?.response?.data || err?.message
        })
      })
      return
    }
    if (isExpired(cookies.jwt)) {
      window.location.replace("/")
    }
  }, [cookies])


  return (
    <>
      <form action="#" onSubmit={Formik.handleSubmit}>
        <Box p={8}>
          <Stack w={'full'} pb={16} gap={8} direction={['column', 'row']} justifyContent={'space-between'}>
            <FormControl>
              <Box>
                <FormLabel fontWeight={'bold'} textTransform={'uppercase'} fontSize={'lg'}>FIRST NAME</FormLabel>
                <Input name='firstName' value={Formik.values.firstName} onChange={Formik.handleChange} bg={'blanchedalmond'} w={['full', 'xs']} />
              </Box>
            </FormControl>
            <FormControl>
              <Box>
                <FormLabel fontWeight={'bold'} textTransform={'uppercase'} fontSize={'lg'}>MIDDLE NAME</FormLabel>
                <Input name='middleName' value={Formik.values.middleName} onChange={Formik.handleChange} bg={'blanchedalmond'} w={['full', 'xs']} />
              </Box>
            </FormControl>
            <FormControl>
              <Box>
                <FormLabel fontWeight={'bold'} textTransform={'uppercase'} fontSize={'lg'}>LAST NAME</FormLabel>
                <Input name='lastName' value={Formik.values.lastName} onChange={Formik.handleChange} bg={'blanchedalmond'} w={['full', 'xs']} />
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
              <Input bg={'blanchedalmond'} w={['full', 'xs']} type='date' name='dob' value={Formik.values.dob} onChange={Formik.handleChange} />
            </HStack>
          </Stack>
          <Stack w={'full'} gap={8} pb={16} direction={['column', 'row']} justifyContent={'space-between'}>
            <FormControl>
              <FormLabel fontWeight={'bold'} textTransform={'uppercase'} fontSize={'lg'}>CONTACT NO</FormLabel>
              <HStack>
                <Input bg={'blanchedalmond'} w={['full', 'xs']} name='phone' value={Formik.values.phone} onChange={Formik.handleChange} />
                <Text>Verify</Text>
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel fontWeight={'bold'} textTransform={'uppercase'} fontSize={'lg'}>EMAIL ID</FormLabel>
              <HStack>
                <Input bg={'blanchedalmond'} w={['full', 'xs']} name='email' value={Formik.values.email} disabled />
                {/* <Text>Verify</Text> */}
              </HStack>
            </FormControl>
          </Stack>
          <Stack w={'full'} pb={16} direction={['column', 'row']} justifyContent={'space-between'}>
            <FormControl>
              <FormLabel fontWeight={'bold'} textTransform={'uppercase'} fontSize={'lg'}>UPLOAD PDF</FormLabel>
              <HStack>
                <Input type='file' bg={'blanchedalmond'} w={['full', 'xs']} name='attachment1' onChange={e => Formik.setFieldValue("attachment1", e.currentTarget.files[0])} />
                <Input type='file' bg={'blanchedalmond'} w={['full', 'xs']} name='attachment2' onChange={e => Formik.setFieldValue("attachment2", e.currentTarget.files[0])} />
              </HStack>
            </FormControl>
          </Stack>
          <HStack>
            <Checkbox required />
            <Text>I have read and accept the Terms & Conditions and Privacy Policy of Virolife Foundation With All My Attention</Text>
          </HStack>
          <HStack justifyContent={'flex-end'}>
            <Button rightIcon={<BsArrowRight />} colorScheme='yellow' type='submit'>Proceed</Button>
          </HStack>
        </Box>
      </form>
    </>
  )
}

export default Info