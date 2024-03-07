"use client";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Show,
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

const ProductData = ({ product }) => {
  const Toast = useToast({ position: "top-right" });
  const { handleError, refreshPoints } = useApiHandler();
  const { payWithRazorpay } = useRazorpay();

  const { onCopy, hasCopied } = useClipboard(
    `
      ${process.env.NEXT_PUBLIC_FRONTEND_URL}/store/${product?.id}
      `
  );
  const shippingFees = Number(product?.delivery_charges)
    ? Number(product?.delivery_charges)
    : 0;

  const [intent, setIntent] = useState("full");
  const [loading, setLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState(
    "https://idea.batumi.ge/files/default.jpg"
  );
  const [images, setImages] = useState([]);
  const [giftCard, setGiftCard] = useState("");
  const [giftCardAmount, setGiftCardAmount] = useState(0);
  const [hasUserProp, setHasUserProp] = useState(false);

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
      productId: product?.id,
      paymentId: trnxnId,
      giftCard: giftCard,
    })
      .then(async (res) => {
        setLoading(false);
        Toast({
          status: "success",
          title: "Purchase succesful!",
          description: "Thank you for your purchase",
        });
        await refreshPoints();
      })
      .catch((err) => {
        setLoading(false);
        handleError(err, "Error while placing order");
      });
  }

  async function handlePurchase() {
    if (intent == "partial") {
      await refreshPoints();
      if (
        Number(localStorage.getItem("atpPoints")) >=
          Number(product?.atp_point) &&
        Number(localStorage.getItem("adPoints")) >= Number(product?.ad_point) &&
        Number(localStorage.getItem("healthPoints")) >=
          Number(product?.health_point)
      ) {
        payWithRazorpay({
          description: product?.name,
          // amount: Number(product?.minimum_payable_amount) + shippingFees,
          orderType: "ecommerce",
          intent: intent,
          productId: product?.id,
          onSuccess: (trnxnId) => {
            setLoading(false);
            placeOrder(trnxnId);
          },
          onFail: () => {
            setLoading(false);
            handleError(err, "Your payment could not be completed!");
          },
        });
      } else {
        Toast({
          status: "error",
          description: "You don't have sufficient points",
        });
      }
    } else {
      payWithRazorpay({
        description: product?.name,
        // amount: Number(product?.minimum_payable_amount) + shippingFees,
        giftCard: giftCard,
        orderType: "ecommerce",
        intent: intent,
        productId: product?.id,
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
    if (product?.images) {
      setSelectedImg(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${
          JSON.parse(product?.images)[0]
        }`
      );
      const campaignImages = JSON.parse(product?.images)?.map(
        (img) => `${process.env.NEXT_PUBLIC_BACKEND_URL}/${img}`
      );
      setImages(campaignImages);
    }
  }, []);

  function verifyGiftCard() {
    BackendAxios.get(`api/gift-card-detail?code=${giftCard}`)
      .then((res) => {
        if (
          !res.data?.user_id ||
          res.data?.user_id == localStorage.getItem("userId")
        ) {
          if (
            !res.data?.redeemed &&
            res.data?.purpose == "ecommerce" &&
            Number(res.data?.amount) <= Number(product?.price)
          ) {
            Toast({
              status: "success",
              description: "Discount code applied successfully!",
            });
            setGiftCardAmount(res.data?.amount);
          }
          if (
            res.data?.redeemed ||
            res.data?.purpose != "ecommerce" ||
            Number(res.data?.amount) >= Number(product?.price)
          ) {
            Toast({
              status: "warning",
              description: "Invalid discount card!",
            });
          }
        } else {
          Toast({
            status: "warning",
            description: "Invalid discount card!",
          });
          setGiftCard("");
        }
      })
      .catch((err) => {
        handleError(err, "Error while getting gift card details");
        setGiftCard("");
        setGiftCardAmount(0);
      });
  }

  useEffect(() => {
    setHasUserProp(Boolean(localStorage.getItem("userId")));
    if (intent != "full") {
      setGiftCard("");
      setGiftCardAmount(0);
    }
  }, [intent]);

  return (
    <>
      {loading ? <FullPageLoader /> : null}
      {hasUserProp ? (
        <HStack py={4} justifyContent={"flex-end"} w={"full"}>
          <Points />
        </HStack>
      ) : null}
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
            {product?.name}
          </Text>
          <Text fontSize={"lg"} fontWeight={"medium"}>
            Min. Payable ₹{product?.minimum_payable_amount}
          </Text>
          <Text pb={8}>Full Price: ₹{product?.price}</Text>
          <Stack direction={["column", "row"]} gap={8} mb={16}>
            <Image
              src={selectedImg}
              w={["100%", "lg", "3xl"]}
              objectFit={"contain"}
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
                  objectFit={"contain"}
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
            Category: {product?.category?.name}
          </Text>
          <br />
          <Text
            maxW={["full", "xl", "4xl"]}
            p={4}
            bgColor={"blue.50"}
            rounded={"12"}
          >
            {product?.description}
          </Text>
          <br />
          <br />
          <Box pb={16} maxW={["full", "xl", "4xl"]}>
            {parse(product?.long_description)}
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
                Choose Buying Options
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
                  Pay Full Price: ₹{product?.price}
                </Text>
                <Text fontSize={"md"} fontWeight={"medium"}>
                  {parseInt(product?.delivery_charges)
                    ? `Shipping Fees: ₹${shippingFees}`
                    : ""}
                </Text>
              </Box>

              {hasUserProp ? (
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
                    {parseInt(product?.minimum_payable_amount)
                      ? `Pay Only: ₹${product?.minimum_payable_amount}`
                      : ""}
                  </Text>
                  <Text fontSize={"md"} fontWeight={"medium"}>
                    {parseInt(product?.delivery_charges)
                      ? `Shipping Fees: ₹${shippingFees}`
                      : ""}
                  </Text>
                  <Text fontSize={"md"} fontWeight={"medium"}>
                    {parseInt(product?.ad_point)
                      ? `Pay with Ad Points: ₹${product?.ad_point}`
                      : ""}
                  </Text>
                  <Text fontSize={"md"} fontWeight={"medium"}>
                    {parseInt(product?.health_point)
                      ? `Pay with Health Points: ₹${product?.health_point}`
                      : ""}
                  </Text>
                  <Text fontSize={"md"} fontWeight={"medium"}>
                    {parseInt(product?.atp_point)
                      ? `Pay with ATP Points: ₹${product?.atp_point}`
                      : ""}
                  </Text>
                </Box>
              ) : <Text mt={4}>Please login to view more buying options</Text>}
              <br />
              {intent == "full" && hasUserProp && product?.gift_card_status === 1 ? (
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
                      cursor={"pointer"}
                    />
                  </InputGroup>
                  {parseInt(giftCardAmount) ? (
                    <Text py={2} color={"whatsapp.500"} fontWeight={"semibold"}>
                      {" "}
                      `₹ ${giftCardAmount} discount applied`{" "}
                    </Text>
                  ) : null}
                </Box>
              ) : null}
              <br />

              <Button
                w={"full"}
                colorScheme="yellow"
                onClick={() => handlePurchase()}
              >
                Buy Now{" "}
                {parseInt(giftCardAmount)
                  ? `₹${Number(product?.price) - Number(giftCardAmount)}`
                  : ""}
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
                Choose Buying Options
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
                  Pay Full Price: ₹{product?.price}
                </Text>
                <Text fontSize={"md"} fontWeight={"medium"}>
                  {parseInt(product?.delivery_charges)
                    ? `Shipping Fees: ₹${shippingFees}`
                    : ""}
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
                  {parseInt(product?.minimum_payable_amount)
                    ? `Pay Only: ₹${product?.minimum_payable_amount}`
                    : ""}
                </Text>
                <Text fontSize={"md"} fontWeight={"medium"}>
                  {parseInt(product?.delivery_charges)
                    ? `Shipping Fees: ₹${shippingFees}`
                    : ""}
                </Text>
                <Text fontSize={"md"} fontWeight={"medium"}>
                  {parseInt(product?.ad_point)
                    ? `Pay with Ad Points: ₹${product?.ad_point}`
                    : ""}
                </Text>
                <Text fontSize={"md"} fontWeight={"medium"}>
                  {parseInt(product?.health_point)
                    ? `Pay with Health Points: ₹${product?.health_point}`
                    : ""}
                </Text>
                <Text fontSize={"md"} fontWeight={"medium"}>
                  {parseInt(product?.atp_point)
                    ? `Pay with ATP Points: ₹${product?.atp_point}`
                    : ""}
                </Text>
              </Box>
              <br />
              {intent == "full" && product?.gift_card_status === 1 ? (
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
                      cursor={"pointer"}
                    />
                  </InputGroup>
                  {parseInt(giftCardAmount) ? (
                    <Text py={2} color={"whatsapp.500"} fontWeight={"semibold"}>
                      {" "}
                      `₹ ${giftCardAmount} discount applied`{" "}
                    </Text>
                  ) : null}
                </Box>
              ) : null}
              <br />

              <Button
                w={"full"}
                colorScheme="yellow"
                onClick={() => handlePurchase()}
              >
                Buy Now{" "}
                {parseInt(giftCardAmount)
                  ? `₹${Number(product?.price) - Number(giftCardAmount)}`
                  : ""}
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
                url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/store/${product?.id}`}
                title={`*${product?.title}*\n${product?.description}\nEven a single contribution can make a difference.\nDonate Now`}
              >
                <WhatsappIcon size={36} round={true} />
              </WhatsappShareButton>

              <FacebookShareButton
                url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/store/${product?.id}`}
                quote={`${product?.title}\n${product?.description}\nEven a single contribution can make a difference.\nDonate Now`}
                title={`${product?.title}\n${product?.description}\nEven a single contribution can make a difference.\nDonate Now`}
              >
                <FacebookIcon size={36} round={true} />
              </FacebookShareButton>

              <LinkedinShareButton
                url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/store/${product?.id}`}
                summary={`${product?.title}\n${product?.description}\nEven a single contribution can make a difference.\nDonate Now`}
                title={`${product?.title}\n${product?.description}\nEven a single contribution can make a difference.\nDonate Now`}
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
