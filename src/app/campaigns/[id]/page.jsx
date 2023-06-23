'use client'
import React, { useState, useEffect } from 'react'
import {
    Box,
    Button,
    FormLabel,
    HStack,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    Progress,
    Show,
    Stack, Text, useToast
} from '@chakra-ui/react'
import BackendAxios from '@/utils/axios'

const CampaignInfo = ({params}) => {
    const Toast = useToast({ position: 'top-right' })
    const [selectedImg, setSelectedImg] = useState("https://t3.ftcdn.net/jpg/04/19/34/24/360_F_419342418_pBHSf17ZBQn77E7z3OWcXrWfCuxZkc3Q.jpg")
    const { id } = params
    const [amount, setAmount] = useState(1000)
    const [campaign, setCampaign] = useState({})

    useEffect(() => {
        BackendAxios.get(`/api/campaign/${id}`).then(res => {
            if(!res.data[0]?.status){
                window.location.replace("/")
                return
            }
            setCampaign(res.data[0])
        }).catch(err => {
            Toast({
                status: 'error',
                description: err?.response?.data?.message || err?.response?.data || err?.message
            })
        })
    }, [])
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
                        textTransform={'capitalize'}
                    >{campaign?.title}
                    </Text>
                    <Text
                        fontSize={['md', 'lg', 'xl']}
                        className='serif' pb={8}
                    >{campaign?.status == 1 ? "Published" : "In Review"} - {new Date(campaign?.updated_at).toDateString()}
                    </Text>
                    <Stack direction={['column', 'row']} gap={8} mb={16}>
                        <Image
                            src={campaign.file_path ? `https://edulec.in/storage/${campaign.file_path}` : "https://idea.batumi.ge/files/default.jpg"}
                            w={['100%', 'lg', '3xl']} objectFit={'cover'} h={['xs', 'lg']} rounded={16}
                        />
                        {/* <Stack
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
                        </Stack> */}
                    </Stack>
                    <Text pb={16} maxW={['full', 'xl', '4xl']}>
                        {campaign.description}
                        <br /><br />
                        {campaign.full_description}
                    </Text>
                </Box>
                <Show above='md'>
                    <Box width={'sm'} h={'inherit'} position={'relative'} p={4}>
                        <Box p={4} boxShadow={'lg'} rounded={8} position={'sticky'} top={0}>
                            <Text fontWeight={'semibold'} className='serif' fontSize={'xl'}>Donate To John Doe</Text>
                            <br />
                            <Progress value={80} colorScheme='yellow' />
                            <HStack justifyContent={'space-between'}>
                                <Text fontSize={'xs'}>₹40,000</Text>
                                <Text fontSize={'xs'}>₹50,000</Text>
                            </HStack>
                            <br />
                            <FormLabel>Enter Amount</FormLabel>
                            <InputGroup>
                                <InputLeftElement children={'₹'} />
                                <Input type='number' value={amount} mb={2} />
                            </InputGroup>
                            <Text py={4}>Platform Fees (5%) : ₹{0.05*Number(amount || 0)}</Text>
                            <Text py={4} pt={0}>Total Payable Amt &nbsp; : ₹{0.05*Number(amount || 0) + amount}</Text>
                            <Button w={'full'} colorScheme='yellow'>Donate Now</Button>
                        </Box>
                    </Box>
                </Show>
                <Show below='md'>
                    <Box width={'full'} h={'inherit'} position={'fixed'} bottom={0} left={0} right={0} p={4} zIndex={999}>
                        <Box p={4} boxShadow={'lg'} bg={'#FFF'} rounded={8} top={0}>
                            <Text fontWeight={'semibold'} className='serif' fontSize={'xl'}>Donate To Sangam Kumar</Text>
                            <br />
                            <HStack justifyContent={'space-between'}>
                                <Text fontSize={'xs'}>₹80,000</Text>
                                <Text fontSize={'xs'}>₹1,00,000</Text>
                            </HStack>
                            <FormLabel>Enter Amount</FormLabel>
                            <InputGroup>
                                <InputLeftElement children={'₹'} />
                                <Input type='number' value={amount} onChange={(e)=>setAmount(e.target.value)} mb={2} />
                            </InputGroup>
                            <Text py={4}>Platform Fees (5%) : ₹{0.05*Number(amount || 0)}</Text>
                            <Button w={'full'} colorScheme='yellow'>Donate Now</Button>
                        </Box>
                    </Box>
                </Show>
            </Stack>
        </>
    )
}

export default CampaignInfo