'use client'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import {
    Text,
    Box,
    Image,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    Textarea,
    HStack,
    Icon,
    useToast,
    Select
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { BsXCircleFill } from 'react-icons/bs';
import BackendAxios, { FormAxios } from '@/utils/axios';

const Page = () => {
    const Toast = useToast({ position: 'top-right' })

    const onDrop = useCallback(async acceptedFiles => {
        console.log(acceptedFiles[0])
        Formik.setFieldValue("files", acceptedFiles[0])
        const newImages = acceptedFiles.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });
        console.log(newImages)
        Promise.all(newImages)
            .then((imagePreviews) => setSelectedImages((prevImages) => [...prevImages, ...imagePreviews]))
            .catch((error) => console.error('Error reading file:', error));
    }, [])
    const removeImage = (index) => {
        setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
        Formik.setFieldValue("files", Formik.values.files.filter((_, i) => i !== index))
    };
    const [selectedImages, setSelectedImages] = useState([])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*', multiple: false })

    const Formik = useFormik({
        initialValues: {
            title: "",
            files: null,
            description: "",
            full_description: "",
        },
        onSubmit: () => {
            const formData = new FormData()
            formData.append("files", Formik.values.files)
            formData.append("title", Formik.values.title)
            formData.append("description", Formik.values.description)
            formData.append("full_description", Formik.values.full_description)
            FormAxios.post("/api/campaign", formData).then(res => {
                Toast({
                    status: 'success',
                    description: "Your campaign was sent for review!"
                })
                console.log(formData)
            }).catch(err => {
                Toast({
                    status: 'error',
                    description: err?.response?.data?.message || err?.response?.data || err?.message
                })
            })
        }
    })

    return (
        <>
            <Text pb={4} fontSize={'2xl'} className='serif'>Create New Campaign</Text>
            <br />
            <FormControl py={4} w={['full', 'xs']}>
                <FormLabel>Select Category</FormLabel>
                <Select>
                    <option value="medical">Medical</option>
                    <option value="education">Education</option>
                    <option value="new startup">New Startup</option>
                    <option value="sports">Sports Help</option>
                </Select>
            </FormControl>
            <FormControl py={4}>
                <FormLabel>Enter title for your campaign</FormLabel>
                <Input
                    w={'full'} variant={'flushed'}
                    fontSize={['xl', '2xl', '3xl']}
                    className='serif' p={2}
                    name='title' onChange={Formik.handleChange}
                />
            </FormControl>
            <Box p={4}>
                <Text pb={4} fontWeight={'semibold'}>Upload Image</Text>
                <VStack
                    {...getRootProps()}
                    w={['full', 'lg']} h={'xs'}
                    rounded={16} border={'1px'}
                    borderStyle={'dashed'}
                    bg={'#FAFAFA'} cursor={'pointer'}
                    justifyContent={'center'}
                >
                    <Input visibility={'hidden'} {...getInputProps()} />
                    {
                        isDragActive ?
                            <Text>Drop Your Files Here...</Text> :
                            <Text>Click to Upload Or Drop Your Files Here...</Text>
                    }
                </VStack>
                <HStack py={4}>
                    {
                        selectedImages.map((image, index) => (
                            <Box key={index} pos={'relative'}>
                                {/* <Icon
                                    as={BsXCircleFill}
                                    color={'red'} pos={'absolute'}
                                    size={12} top={0} right={0}
                                    onClick={() => removeImage(index)}
                                /> */}
                                <Image src={image} w={36} h={36} rounded={16} objectFit={'cover'} />
                            </Box>
                        ))
                    }
                </HStack>
            </Box>
            <FormControl py={4}>
                <FormLabel>Short Description (15-20 words)</FormLabel>
                <Textarea
                    w={'full'} name='description'
                    onChange={Formik.handleChange}
                    placeholder='Brief description of your campaign'
                ></Textarea>
            </FormControl>
            <FormControl py={4}>
                <FormLabel>Your message</FormLabel>
                <Textarea
                    w={'full'} name='full_description'
                    onChange={Formik.handleChange}
                    placeholder='Tell us about your campaign'
                ></Textarea>
            </FormControl>
            <HStack justifyContent={'flex-end'} py={4}>
                <Button colorScheme='yellow' onClick={Formik.handleSubmit}>Send For Review</Button>
            </HStack>
        </>
    )
}

export default Page