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
  InputRightAddon,
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
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";
import Points from "../dashboard/Points";
import FullPageLoader from "../global/FullPageLoader";
import useRazorpay from "@/utils/hooks/useRazorpay";

const ProductData = ({ campaign }) => {
  const Toast = useToast({ position: "top-right" });
  const { handleError } = useApiHandler();
  const { payWithRazorpay } = useRazorpay();

  const { value, setValue, onCopy, hasCopied } = useClipboard(
    `
      ${process.env.NEXT_PUBLIC_FRONTEND_URL}/store/${campaign?.id}
      `
  );

  const [intent, setIntent] = useState("full");
  const [loading, setLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState(
    "https://idea.batumi.ge/files/default.jpg"
  );
  const [images, setImages] = useState([]);
  const [giftCard, setGiftCard] = useState("");
  const [giftCardAmount, setGiftCardAmount] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [donationCardStatus, setDonationCardStatus] = useState(true);

  function placeOrder(trnxnId) {
    if (!intent) {
      Toast({
        description: "Please select your payment type",
      });
      return;
    }
    setLoading(true);
    BackendAxios.post(`/api/orders`, {
      intent: intent,
      productId: campaign?.id,
      paymentId: trnxnId,
    })
      .then((res) => {
        setLoading(false);
        Toast({
          status: "success",
          title: "Purchase succesful!",
          description: "Thank you for your purchase",
        });
      })
      .catch((err) => {
        setLoading(false);
        handleError(err, "Error while placing order");
      });
  }

  function handlePurchase() {
    setLoading(true);
    if (campaign?.minimum_payable_amount > 0 && intent == "partial") {
      payWithRazorpay({
        amount: Number(campaign?.minimum_payable_amount),
        onSuccess: (trnxnId) => {
          setLoading(false);
          placeOrder(trnxnId);
        },
        onFail: () => {
          setLoading(false);
          handleError(err, "Your payment could not be completed!");
        },
      });
    }
    if (campaign?.minimum_payable_amount == 0 && intent == "partial") {
      setLoading(false);
      placeOrder();
    }
    if (intent == "full") {
      payWithRazorpay({
        amount: parseInt(giftCardAmount)
          ? Number(campaign?.price) - Number(giftCardAmount)
          : Number(campaign?.price),
        onSuccess: (trnxnId) => {
          setLoading(false);
          placeOrder(trnxnId);
        },
        onFail: () => {
          setLoading(false);
          handleError(err, "Your payment could not be completed!");
        },
      });
    }
  }

  useEffect(() => {
    if (campaign?.images) {
      setSelectedImg(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${
          JSON.parse(campaign?.images)[0]
        }`
      );
      const campaignImages = JSON.parse(campaign?.images)?.map(
        (img) => `${process.env.NEXT_PUBLIC_BACKEND_URL}/${img}`
      );
      setImages(campaignImages);
    }
  }, []);

  function verifyGiftCard() {
    BackendAxios.post(`api/gift-card-detail`, {
      code: giftCard,
    })
      .then((res) => {
        console.log(res.data);
        Toast({
          status: "success",
          description: "Discount code applied successfully!",
        });
      })
      .catch((err) => {
        handleError(err, "Error while getting gift card details");
        setGiftCard("");
        setGiftCardAmount(0);
      });
  }

  return (
    <>
      {loading ? <FullPageLoader /> : null}
      <HStack py={4} justifyContent={"flex-end"} w={"full"}>
        <Points />
      </HStack>
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
            {campaign?.name}
          </Text>
          <Text fontSize={"lg"} fontWeight={"medium"}>
            ₹{campaign?.price}
          </Text>
          <Text pb={8}>Price: ₹{campaign?.price}</Text>
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
            {campaign?.description}
          </Text>
          <br />
          <br />
          <Box pb={16} maxW={["full", "xl", "4xl"]}>
            {parse(campaign?.long_description)}
          </Box>
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
                Buying Options
              </Text>
              <br />

              <Box
                p={4}
                my={4}
                rounded={12}
                border={"1px"}
                borderColor={intent == "full" ? "yellow.500" : "gray.50"}
                bgColor={intent == "full" ? "yellow.50" : "#fff"}
                onClick={() => setIntent("full")}
                cursor={"pointer"}
              >
                <Text fontSize={"md"} fontWeight={"medium"}>
                  Pay Full Price: ₹{campaign?.price}
                </Text>
              </Box>

              <Box
                p={4}
                my={4}
                rounded={12}
                border={"1px"}
                borderColor={intent == "partial" ? "yellow.500" : "gray.50"}
                bgColor={intent == "partial" ? "yellow.50" : "#fff"}
                onClick={() => setIntent("partial")}
                cursor={"pointer"}
              >
                <Text fontSize={"md"} fontWeight={"medium"}>
                  {parseInt(campaign?.minimum_payable_amount)
                    ? `Pay Only: ₹${campaign?.minimum_payable_amount}`
                    : ""}
                </Text>
                <Text fontSize={"md"} fontWeight={"medium"}>
                  {parseInt(campaign?.ad_point)
                    ? `Pay with Ad Points: ₹${campaign?.ad_point}`
                    : ""}
                </Text>
                <Text fontSize={"md"} fontWeight={"medium"}>
                  {parseInt(campaign?.health_point)
                    ? `Pay with Health Points: ₹${campaign?.health_point}`
                    : ""}
                </Text>
                <Text fontSize={"md"} fontWeight={"medium"}>
                  {parseInt(campaign?.atp_point)
                    ? `Pay with ATP Points: ₹${campaign?.atp_point}`
                    : ""}
                </Text>
              </Box>
              <br />
              <br />

              <Button
                w={"full"}
                colorScheme="yellow"
                onClick={() => handlePurchase()}
              >
                Buy Now
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
                Buying Options
              </Text>
              <br />

              <Box
                p={4}
                my={4}
                rounded={12}
                border={"1px"}
                borderColor={intent == "full" ? "yellow.500" : "gray.50"}
                bgColor={intent == "full" ? "yellow.50" : "#fff"}
                onClick={() => setIntent("full")}
                cursor={"pointer"}
              >
                <Text fontSize={"md"} fontWeight={"medium"}>
                  Pay Full Price: ₹{campaign?.price}
                </Text>
              </Box>

              <Box
                p={4}
                my={4}
                rounded={12}
                border={"1px"}
                borderColor={intent == "partial" ? "yellow.500" : "gray.50"}
                bgColor={intent == "partial" ? "yellow.50" : "#fff"}
                onClick={() => setIntent("partial")}
                cursor={"pointer"}
              >
                <Text fontSize={"md"} fontWeight={"medium"}>
                  {parseInt(campaign?.minimum_payable_amount)
                    ? `Pay Only: ₹${campaign?.minimum_payable_amount}`
                    : ""}
                </Text>
                <Text fontSize={"md"} fontWeight={"medium"}>
                  {parseInt(campaign?.ad_point)
                    ? `Pay with Ad Points: ₹${campaign?.ad_point}`
                    : ""}
                </Text>
                <Text fontSize={"md"} fontWeight={"medium"}>
                  {parseInt(campaign?.health_point)
                    ? `Pay with Health Points: ₹${campaign?.health_point}`
                    : ""}
                </Text>
                <Text fontSize={"md"} fontWeight={"medium"}>
                  {parseInt(campaign?.atp_point)
                    ? `Pay with ATP Points: ₹${campaign?.atp_point}`
                    : ""}
                </Text>
              </Box>
              <br />
              {intent == "full" ? (
                <Box p={4} my={4}>
                  <Text fontSize={"xs"}>Discount Card</Text>
                  <InputGroup>
                    <Input
                      name="discountCard"
                      onChange={(e) => setGiftCard(e.target.value)}
                    />
                    <InputRightAddon
                      children={"Verify"}
                      onClick={() => verifyGiftCard()}
                    />
                  </InputGroup>
                </Box>
              ) : null}
              <br />

              <Button
                w={"full"}
                colorScheme="yellow"
                onClick={() => handlePurchase()}
              >
                Buy Now
              </Button>
            </Box>
          </Box>
        </Show>
      </Stack>

      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share this product</ModalHeader>
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
                url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/store/${campaign?.id}`}
                title={`*${campaign?.title}*\n${campaign?.description}\nEven a single contribution can make a difference.\nDonate Now`}
              >
                <WhatsappIcon size={36} round={true} />
              </WhatsappShareButton>

              <FacebookShareButton
                url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/store/${campaign?.id}`}
                quote={`${campaign?.title}\n${campaign?.description}\nEven a single contribution can make a difference.\nDonate Now`}
                title={`${campaign?.title}\n${campaign?.description}\nEven a single contribution can make a difference.\nDonate Now`}
              >
                <FacebookIcon size={36} round={true} />
              </FacebookShareButton>

              <LinkedinShareButton
                url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/store/${campaign?.id}`}
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

export default ProductData;