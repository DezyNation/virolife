"use client";
import React, { useState, useEffect } from "react";
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
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import BackendAxios from "@/utils/axios";
import { BsHeartFill } from "react-icons/bs";
import Footer from "@/components/global/Footer";

const CampaignInfo = ({ params }) => {
  const Toast = useToast({ position: "top-right" });
  const [selectedImg, setSelectedImg] = useState(
    "https://t3.ftcdn.net/jpg/04/19/34/24/360_F_419342418_pBHSf17ZBQn77E7z3OWcXrWfCuxZkc3Q.jpg"
  );
  const { id } = params;
  const [amount, setAmount] = useState(1000);
  const [fees, setFees] = useState(5);
  const [campaign, setCampaign] = useState({});

  useEffect(() => {
    BackendAxios.get(`/api/campaign/${id}`)
      .then((res) => {
        if (!res.data[0]?.status) {
          window.location.replace("/");
          return;
        }
        setCampaign(res.data[0]);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }, []);
  return (
    <>
      <Stack
        p={[4, 16, 24]}
        direction={["column", "row"]}
        justifyContent={"space-between"}
      >
        {/* Campaign Details */}
        <Box>
          <Text
            fontSize={["2xl", "3xl", "4xl"]}
            fontWeight={"semibold"}
            textTransform={"capitalize"}
          >
            {campaign?.title}
          </Text>
          <Text pb={8}>
            Need ₹{campaign?.target_amount} till &nbsp;
            {new Date(campaign?.updated_at).toDateString()}
          </Text>
          <Stack direction={["column", "row"]} gap={8} mb={16}>
            <Image
              src={
                campaign.file_path
                  ? `https://edulec.in/storage/${campaign.file_path}`
                  : "https://idea.batumi.ge/files/default.jpg"
              }
              w={["100%", "lg", "3xl"]}
              objectFit={"cover"}
              h={["xs", "sm"]}
              rounded={16}
            />
            {/* 
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
                        */}
          </Stack>
          <Text fontWeight={"semibold"}>
            Category: {campaign?.category?.name}
          </Text>
          <br />

          <Text pb={16} maxW={["full", "xl", "4xl"]}>
            {campaign.description}
            <br />
            <br />
            {campaign.full_description}
          </Text>
        </Box>
        <Show above="md">
          <Box width={"sm"} h={"inherit"} position={"relative"} p={4}>
            <Box p={4} boxShadow={"lg"} rounded={8} position={"sticky"} top={0}>
              <Text fontWeight={"semibold"} className="serif" fontSize={"xl"}>
                Donate To John Doe
              </Text>
              <br />
              <Progress value={80} colorScheme="yellow" />
              <HStack justifyContent={"space-between"}>
                <Text fontSize={"xs"}>₹40,000</Text>
                <Text fontSize={"xs"}>₹{campaign?.target_amount}</Text>
              </HStack>
              <br />
              <FormLabel>Enter Amount</FormLabel>
              <InputGroup>
                <InputLeftElement children={"₹"} />
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} mb={2} />
              </InputGroup>
              <br />
              <Text fontSize={"sm"}>Choose Platform Fees</Text>
              <Slider
                defaultValue={5}
                min={5}
                max={18}
                step={1}
                onChange={(val) => setFees(val)}
              >
                <SliderTrack bg="yellow.100">
                  <SliderFilledTrack bg="orange" />
                </SliderTrack>
                <SliderThumb boxSize={6}>
                  <Box color="orange" as={BsHeartFill} />
                </SliderThumb>
                <SliderMark
                  value={fees}
                  textAlign="center"
                  bg="yellow.500"
                  color="white"
                  mt="-10"
                  ml="-5"
                  w="12"
                >
                  {fees}%
                </SliderMark>
              </Slider>
              <br />
              <Text py={4}>
                Platform Fees : ₹{(Number(fees) / 100) * Number(amount || 0)}
              </Text>
              <Text py={4} pt={0}>
                Total Payable Amt &nbsp; : ₹
                {(Number(fees) / 100) * Number(amount || 0) + Number(amount)}
              </Text>
              <Button w={"full"} colorScheme="yellow">
                Donate Now
              </Button>
            </Box>
          </Box>
        </Show>
        <Show below="md">
          <Box
            width={"full"}
            h={"inherit"}
            position={"fixed"}
            bottom={0}
            left={0}
            right={0}
            p={4}
            zIndex={999}
          >
            <Box p={4} boxShadow={"lg"} bg={"#FFF"} rounded={8} top={0}>
              <Text fontWeight={"semibold"} className="serif" fontSize={"xl"}>
                Donate To Sangam Kumar
              </Text>
              <br />
              <Progress value={80} colorScheme="yellow" />
              <HStack justifyContent={"space-between"}>
                <Text fontSize={"xs"}>₹80,000</Text>
                <Text fontSize={"xs"}>₹{campaign?.target_amount}</Text>
              </HStack>
              <br />
              <FormLabel>Enter Amount</FormLabel>
              <InputGroup>
                <InputLeftElement children={"₹"} />
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  mb={2}
                />
              </InputGroup>
              <br />
              <Text fontSize={"sm"}>Choose Platform Fees</Text>
              <Slider
                defaultValue={5}
                min={5}
                max={18}
                step={1}
                onChange={(val) => setFees(val)}
              >
                <SliderTrack bg="yellow.100">
                  <SliderFilledTrack bg="orange" />
                </SliderTrack>
                <SliderThumb boxSize={6}>
                  <Box color="orange" as={BsHeartFill} />
                </SliderThumb>
                <SliderMark
                  value={fees}
                  textAlign="center"
                  bg="yellow.500"
                  color="white"
                  mt="-10"
                  ml="-5"
                  w="12"
                >
                  {fees}%
                </SliderMark>
              </Slider>
              <br />
              <Text py={4}>
                Platform Fees : ₹{(Number(fees) / 100) * Number(amount || 0)}
              </Text>
              <Text py={4} pt={0}>
                Total Payable Amt &nbsp; : ₹
                {(Number(fees) / 100) * Number(amount || 0) + Number(amount)}
              </Text>
              <Button w={"full"} colorScheme="yellow">
                Donate Now
              </Button>
            </Box>
          </Box>
        </Show>
      </Stack>
            <Footer />
    </>
  );
};

export default CampaignInfo;
