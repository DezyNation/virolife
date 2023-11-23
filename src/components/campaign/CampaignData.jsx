"use client";
import {
  Box,
  Button,
  FormLabel,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Show,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  VStack,
  useClipboard,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  BsChevronDoubleDown,
  BsChevronDoubleUp,
  BsClipboard,
  BsHeartFill,
  BsShareFill,
} from "react-icons/bs";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "react-share";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import useRazorpay from "@/utils/hooks/useRazorpay";
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";
import FullPageLoader from "../global/FullPageLoader";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const CampaignData = ({ campaign }) => {
  const Toast = useToast({ position: "top-right" });
  const params = useSearchParams();

  const prefilAmount = params.get("prefil_amount");

  const { push } = useRouter();
  const { handleError } = useApiHandler();
  const { value, setValue, onCopy, hasCopied } = useClipboard(
    `
      ${process.env.NEXT_PUBLIC_FRONTEND_URL}/campaigns/${campaign?.id}
      `
  );

  const [loading, setLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState(
    "https://idea.batumi.ge/files/default.jpg"
  );
  const [images, setImages] = useState([]);
  const [amount, setAmount] = useState(1000);
  const [fees, setFees] = useState(5);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [donationCardStatus, setDonationCardStatus] = useState(true);

  const Formik = useFormik({
    initialValues: {
      amount: 1000,
      fees: 5,
      name: "",
      phone: "",
    },
    onSubmit: (values) => {
      if (!values.name || !values.phone) {
        Toast({ description: "Name and phone no. are required" });
        return;
      }
      // payWithRazorpay({
      //   amount: amount,
      //   description: campaign?.title,
      //   user: {
      //     name: values.name,
      //     phone: values.phone,
      //   },
      //   onSuccess: (trnxnId) => {
      //     setLoading(true);
      //     BackendAxios.post(`/api/donate-campaign`, {
      //       campaignId: campaign?.id,
      //       amount: amount,
      //       name: values.name,
      //       phoneNumber: values.phone,
      //       tip: (Number(fees) / 100) * Number(Formik.values.amount || 0),
      //       transactionId: trnxnId,
      //     })
      //       .then((res) => {
      //         setLoading(false);
      //         Toast({
      //           status: "success",
      //           title: "Thank you for your donation!",
      //           description: "A receipt has been sent to your email",
      //         });
      //       })
      //       .catch((err) => {
      //         setLoading(false);
      //         handleError(err, "Error while adding your donation");
      //       });
      //   },
      //   onFail: () => {
      //     Toast({
      //       status: "warning",
      //       title: "Transaction Failed.",
      //       description:
      //         "There was an error processing your payment with Razorpay!",
      //     });
      //   },
      // });
      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donate-campaign`, {
          campaignId: campaign?.id,
          amount: amount,
          name: values.name,
          phoneNumber: values.phone,
          // tip: (Number(fees) / 100) * Number(Formik.values.amount || 0),
        })
        .then((res) => {
          // setLoading(false);
          push(
            `/payment?order_id=${res.data?.order_id}&amount=${res.data?.amount}&description=${campaign?.title}`
          );
        })
        .catch((err) => {
          setLoading(false);
          handleError(err, "Error while adding your donation");
        });
    },
  });

  useEffect(() => {
    setAmount(parseInt(prefilAmount));
    Formik.setFieldValue("amount", prefilAmount);
  }, [prefilAmount]);

  useEffect(() => {
    console.log(campaign);
    if (campaign?.file_path) {
      setSelectedImg(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${
          JSON.parse(campaign?.file_path)[0]
        }`
      );
      const campaignImages = JSON.parse(campaign?.file_path)?.map(
        (img) => `${process.env.NEXT_PUBLIC_BACKEND_URL}/${img}`
      );
      setImages(campaignImages);
    }
  }, []);

  useEffect(() => {
    const calcAmount =
      (Number(fees) / 100) * Number(Formik.values.amount || 0) +
      Number(Formik.values.amount);
    setAmount(calcAmount);
  }, [Formik.values.amount, fees]);

  return (
    <>
      {loading ? <FullPageLoader /> : null}
      <Stack
        p={[4, 16, 24]}
        direction={["column", "row"]}
        justifyContent={"space-between"}
      >
        {/* Campaign Details */}
        <Box flex={["unset", 3]}>
          <Text
            fontSize={["2xl", "3xl", "4xl"]}
            fontWeight={"semibold"}
            textTransform={"capitalize"}
          >
            {campaign?.title}
          </Text>
          <Text pb={8}>
            Need ₹{Number(campaign?.target_amount)?.toLocaleString("en-IN")}{" "}
            till &nbsp;
            {new Date(campaign?.updated_at).toDateString()} - Campaign By{" "}
            {campaign?.user?.name}
          </Text>
          <Stack direction={["column", "row"]} gap={8} mb={16}>
            <Image
              src={selectedImg}
              w={["100%", "lg", "3xl"]}
              objectFit={"cover"}
              h={["xs", "sm"]}
              rounded={16}
            />

            <Stack
              direction={["row", "column"]}
              w={["full", "48"]}
              h={["auto", "lg"]}
              gap={6}
              overflowX={["scroll", "visible"]}
              overflowY={["visible", "scroll"]}
              className="hide-scrollbar"
            >
              {images.map((img, key) => (
                <Image
                  key={key}
                  src={img}
                  boxSize={["24"]}
                  objectFit={"cover"}
                  rounded={16}
                  cursor={"pointer"}
                  onClick={() => setSelectedImg(img)}
                  border={"2px"}
                  borderColor={
                    selectedImg == img ? "yellow.400" : "transparent"
                  }
                />
              ))}
            </Stack>
          </Stack>
          <HStack justifyContent={"flex-end"}>
            <Button
              variant={"ghost"}
              leftIcon={<BsShareFill />}
              onClick={onOpen}
              colorScheme="yellow"
            >
              Share This Campaign
            </Button>
          </HStack>
          <Text fontWeight={"semibold"}>
            Category: {campaign?.category?.name}
          </Text>
          <br />
          <Text
            maxW={["full", "xl", "4xl"]}
            p={4}
            bgColor={"blue.50"}
            rounded={"12"}
          >
            {campaign?.beneficiary_details != null &&
            campaign?.beneficiary_details != "null" ? (
              <>
                This campaign will benefit{" "}
                {JSON.parse(campaign?.beneficiary_details)?.name}
                {JSON.parse(campaign?.beneficiary_details)?.address
                  ? ` of ${JSON.parse(campaign?.beneficiary_details)?.address}`
                  : ""}
                <br />
              </>
            ) : null}
            {campaign?.description}
          </Text>
          <br />
          <br />
          <Box pb={16} maxW={["full", "xl", "4xl"]}>
            {parse(campaign?.full_description)}
          </Box>
          {/* <Text pb={16} maxW={["full", "xl", "4xl"]}>
            {campaign?.full_description}
          </Text> */}
        </Box>

        <Show above="md">
          <Box
            pos={"relative"}
            width={"sm"}
            h={"inherit"}
            position={"relative"}
            p={4}
            flex={["unset", 1]}
          >
            <Box p={4} boxShadow={"lg"} rounded={8} position={"sticky"} top={0}>
              <Text fontWeight={"semibold"} className="serif" fontSize={"xl"}>
                Donate To {campaign?.user?.name}
              </Text>
              <br />
              <Progress
                value={
                  (parseInt(campaign?.total_donations) /
                    parseInt(campaign?.target_amount)) *
                  100
                }
                colorScheme="yellow"
              />
              <HStack justifyContent={"space-between"}>
                <Text fontSize={"xs"}>
                  ₹ {Number(campaign?.total_donations).toLocaleString("en-IN")}
                </Text>
                <Text fontSize={"xs"}>
                  ₹{Number(campaign?.target_amount)?.toLocaleString("en-IN")}
                </Text>
              </HStack>
              <br />
              <FormLabel>Enter Amount</FormLabel>
              <InputGroup>
                <InputLeftElement children={"₹"} />
                <Input
                  name="amount"
                  value={Formik.values.amount}
                  onChange={Formik.handleChange}
                  mb={2}
                  isDisabled={parseInt(prefilAmount) > 0}
                />
              </InputGroup>
              <br />
              <FormLabel>Your Name</FormLabel>
              <Input
                name="name"
                value={Formik.values.name}
                onChange={Formik.handleChange}
                mb={2}
              />
              <br />
              <FormLabel>Your Phone No.</FormLabel>
              <Input
                name="phone"
                value={Formik.values.phone}
                onChange={Formik.handleChange}
                mb={2}
              />
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
                Platform Fees : ₹
                {(
                  (Number(fees) / 100) *
                  Number(Formik.values.amount || 0)
                ).toLocaleString("en-IN")}
              </Text>
              <Text py={4} pt={0}>
                Total Payable Amt &nbsp; : ₹
                {(
                  (Number(fees) / 100) * Number(Formik.values.amount || 0) +
                  Number(Formik.values.amount)
                ).toLocaleString("en-IN")}
              </Text>
              <Button
                w={"full"}
                colorScheme="yellow"
                onClick={Formik.handleSubmit}
              >
                Donate Now
              </Button>
            </Box>
          </Box>
        </Show>

        {/* Mobile donation card */}
        <Show below="md">
          {donationCardStatus ? (
            <Box
              position={"fixed"}
              top={0}
              left={0}
              right={0}
              bottom={0}
              bgColor={"blackAlpha.600"}
              w={"full"}
              h={"100vh"}
            ></Box>
          ) : null}
          <Box
            width={"full"}
            h={"inherit"}
            position={"fixed"}
            bottom={donationCardStatus ? 0 : "-60vh"}
            left={0}
            right={0}
            p={4}
            zIndex={999}
            transition={"all .3s ease-in-out"}
          >
            <IconButton
              p={2}
              rounded={"full"}
              boxShadow={"md"}
              pos={"absolute"}
              top={"-2"}
              right={2}
              as={donationCardStatus ? BsChevronDoubleDown : BsChevronDoubleUp}
              bgColor={"#FFF"}
              color={"#000"}
              size={"sm"}
              onClick={() => setDonationCardStatus(!donationCardStatus)}
            />
            <Box p={4} boxShadow={"lg"} bg={"#FFF"} rounded={8} top={0}>
              <Text fontWeight={"semibold"} className="serif" fontSize={"xl"}>
                Donate To {campaign?.user?.name}
              </Text>
              <br />
              <Progress
                value={
                  (parseInt(campaign?.total_donations) /
                    parseInt(campaign?.target_amount)) *
                  100
                }
                colorScheme="yellow"
              />
              <HStack justifyContent={"space-between"}>
                <Text fontSize={"xs"}>₹{Number(campaign?.total_donations)?.toLocaleString("en-IN")}</Text>
                <Text fontSize={"xs"}>₹{campaign?.target_amount}</Text>
              </HStack>
              <br />
              <FormLabel>Enter Amount</FormLabel>
              <InputGroup>
                <InputLeftElement children={"₹"} />
                <Input
                  name="amount"
                  value={Formik.values.amount}
                  onChange={Formik.handleChange}
                  mb={2}
                  isDisabled={parseInt(prefilAmount) > 0}
                />
              </InputGroup>
              <br />
              <FormLabel>Your Name</FormLabel>
              <Input
                name="name"
                value={Formik.values.name}
                onChange={Formik.handleChange}
                mb={2}
              />
              <br />
              <FormLabel>Your Phone No.</FormLabel>
              <Input
                name="phone"
                value={Formik.values.phone}
                onChange={Formik.handleChange}
                mb={2}
              />
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
                Platform Fees : ₹
                {(
                  (Number(fees) / 100) *
                  Number(Formik.values.amount || 0)
                ).toLocaleString("en-IN")}
              </Text>
              <Text py={4} pt={0}>
                Total Payable Amt &nbsp; : ₹
                {(
                  (Number(fees) / 100) * Number(Formik.values.amount || 0) +
                  Number(Formik.values.amount)
                ).toLocaleString("en-IN")}
              </Text>
              <Button
                w={"full"}
                colorScheme="yellow"
                onClick={Formik.handleSubmit}
              >
                Donate Now
              </Button>
            </Box>
          </Box>
        </Show>
      </Stack>

      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share this campaign</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              p={4}
              w={"full"}
              border={"1px"}
              borderStyle={"dashed"}
              rounded={12}
              bgColor={"blanchedalmond"}
              color={"#333"}
              alignItems={"center"}
              justifyContent={"center"}
              onClick={onCopy}
              cursor={"pointer"}
            >
              <HStack w={"full"} justifyContent={"center"}>
                <BsClipboard />
                <Text>{hasCopied ? "Link Copied!" : "Click To Copy Link"}</Text>
              </HStack>
            </VStack>
            <Text pt={4} textAlign={"center"}>
              Other ways to share
            </Text>
            <HStack
              py={4}
              gap={6}
              w={"full"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <WhatsappShareButton
                url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/campaigns/${campaign?.id}`}
                title={`*${campaign?.title}*\n${campaign?.description}\nEven a single contribution can make a difference.\nDonate Now`}
              >
                <WhatsappIcon size={36} round={true} />
              </WhatsappShareButton>

              <FacebookShareButton
                url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/campaigns/${campaign?.id}`}
                quote={`${campaign?.title}\n${campaign?.description}\nEven a single contribution can make a difference.\nDonate Now`}
                title={`${campaign?.title}\n${campaign?.description}\nEven a single contribution can make a difference.\nDonate Now`}
              >
                <FacebookIcon size={36} round={true} />
              </FacebookShareButton>

              <LinkedinShareButton
                url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/campaigns/${campaign?.id}`}
                summary={`${campaign?.title}\n${campaign?.description}\nEven a single contribution can make a difference.\nDonate Now`}
                title={`${campaign?.title}\n${campaign?.description}\nEven a single contribution can make a difference.\nDonate Now`}
              >
                <LinkedinIcon size={36} round={true} />
              </LinkedinShareButton>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CampaignData;
