'use client'
import React, { useState } from 'react'
import {
    Box,
    Button,
    FormLabel,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    Show,
    Stack, Text
} from '@chakra-ui/react'

const CampaignInfo = () => {
    const [selectedImg, setSelectedImg] = useState("https://t3.ftcdn.net/jpg/04/19/34/24/360_F_419342418_pBHSf17ZBQn77E7z3OWcXrWfCuxZkc3Q.jpg")
    return (
        <>
            <Stack
                p={[4, 16, 24]}
                direction={['column', 'row']}
                justifyContent={'space-between'}
            >
                {/* Campaign Details */}
                <Box>
                    <Text
                        fontSize={['2xl', '3xl', '4xl']}
                        fontWeight={'semibold'}
                    >Save Our Cows
                    </Text>
                    <Text
                        fontSize={['md', 'lg', 'xl']}
                        className='serif' pb={8}
                    >Campaign By John Doe - 04 June 2023
                    </Text>
                    <Stack direction={['column', 'row']} gap={8} mb={16}>
                        <Image
                            src={selectedImg}
                            w={['100%', 'lg', '3xl']} objectFit={'cover'} h={['xs', 'lg']} rounded={16}
                        />
                        <Stack
                            direction={['row', 'column']}
                            w={['full', '48']}
                            h={['auto', 'lg']} gap={6}
                            overflowX={['scroll', 'visible']}
                            overflowY={['visible', 'scroll']}
                            className='hide-scrollbar'
                        >
                            <Image
                                src={"https://t3.ftcdn.net/jpg/04/19/34/24/360_F_419342418_pBHSf17ZBQn77E7z3OWcXrWfCuxZkc3Q.jpg"}
                                boxSize={['24']} objectFit={'cover'}
                                rounded={16} cursor={'pointer'}
                                onClick={() => setSelectedImg("https://t3.ftcdn.net/jpg/04/19/34/24/360_F_419342418_pBHSf17ZBQn77E7z3OWcXrWfCuxZkc3Q.jpg")}
                                border={'2px'} borderColor={selectedImg == "https://t3.ftcdn.net/jpg/04/19/34/24/360_F_419342418_pBHSf17ZBQn77E7z3OWcXrWfCuxZkc3Q.jpg" ? "yellow.400" : 'transparent'}
                            />
                            <Image
                                src={"https://imgnew.outlookindia.com/uploadimage/library/16_9/16_9_5/IMAGE_1675431757.jpg"}
                                boxSize={['24']} objectFit={'cover'}
                                rounded={16} cursor={'pointer'}
                                onClick={() => setSelectedImg("https://imgnew.outlookindia.com/uploadimage/library/16_9/16_9_5/IMAGE_1675431757.jpg")}
                                border={'2px'} borderColor={selectedImg == "https://imgnew.outlookindia.com/uploadimage/library/16_9/16_9_5/IMAGE_1675431757.jpg" ? "yellow.400" : 'transparent'}
                            />
                            <Image
                                src={"https://wellnessworks.in/wp-content/uploads/2019/10/indian-cow.jpg"}
                                boxSize={['24']} objectFit={'cover'}
                                rounded={16} cursor={'pointer'}
                                onClick={() => setSelectedImg("https://wellnessworks.in/wp-content/uploads/2019/10/indian-cow.jpg")}
                                border={'2px'} borderColor={selectedImg == "https://wellnessworks.in/wp-content/uploads/2019/10/indian-cow.jpg" ? "yellow.400" : 'transparent'}
                            />
                        </Stack>
                    </Stack>
                    <Text pb={16} maxW={['full', 'xl', '4xl']}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque eligendi ullam aut alias soluta quod ipsam, suscipit sequi iusto nulla illum dolorum pariatur dolorem perferendis odio
                        Ex ea sunt quibusdam, ducimus fugiat fuga consequuntur consequatur.
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit ipsam debitis quisquam similique itaque perspiciatis eius animi nostrum totam ea! Voluptatem, iste. Velit, reiciendis?
                        <br /><br />
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque eligendi ullam aut alias soluta quod ipsam, suscipit sequi iusto nulla illum dolorum pariatur dolorem perferendis odio
                        Ex ea sunt quibusdam, ducimus fugiat fuga consequuntur consequatur.
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit ipsam debitis quisquam similique itaque perspiciatis eius animi nostrum totam ea! Voluptatem, iste. Velit, reiciendis?
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque eligendi ullam aut alias soluta quod ipsam, suscipit sequi iusto nulla illum dolorum pariatur dolorem perferendis odio
                        Ex ea sunt quibusdam, ducimus fugiat fuga consequuntur consequatur.
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit ipsam debitis quisquam similique itaque perspiciatis eius animi nostrum totam ea! Voluptatem, iste. Velit, reiciendis?
                        <br /><br />
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque eligendi ullam aut alias soluta quod ipsam, suscipit sequi iusto nulla illum dolorum pariatur dolorem perferendis odio
                        Ex ea sunt quibusdam, ducimus fugiat fuga consequuntur consequatur.
                    </Text>
                </Box>
                <Show above='md'>
                    <Box width={'sm'} h={'inherit'} position={'relative'} p={4}>
                        <Box p={4} boxShadow={'lg'} rounded={8} position={'sticky'} top={0}>
                            <Text fontWeight={'semibold'} className='serif' fontSize={'xl'}>Donate To John Doe</Text>
                            <br />
                            <FormLabel>Enter Amount</FormLabel>
                            <InputGroup>
                                <InputLeftElement children={'₹'} />
                                <Input type='number' mb={2} />
                            </InputGroup>
                            <Button w={'full'} colorScheme='yellow'>Donate Now</Button>
                        </Box>
                    </Box>
                </Show>
                <Show below='md'>
                    <Box width={'full'} h={'inherit'} position={'fixed'} bottom={0} left={0} right={0} p={4} zIndex={999}>
                        <Box p={4} boxShadow={'lg'} bg={'#FFF'} rounded={8} top={0}>
                            <Text fontWeight={'semibold'} className='serif' fontSize={'xl'}>Donate To John Doe</Text>
                            <br />
                            <FormLabel>Enter Amount</FormLabel>
                            <InputGroup>
                                <InputLeftElement children={'₹'} />
                                <Input type='number' mb={2} />
                            </InputGroup>
                            <Button w={'full'} colorScheme='yellow'>Donate Now</Button>
                        </Box>
                    </Box>
                </Show>
            </Stack>
        </>
    )
}

export default CampaignInfo