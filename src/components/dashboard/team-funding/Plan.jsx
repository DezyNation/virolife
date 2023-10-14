"use client";
import BackendAxios from "@/utils/axios";
import useRazorpay from "@/utils/hooks/useRazorpay";
import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const Plan = ({
  id,
  bgColor,
  color = "#FFF",
  title,
  price,
  description,
  subscribedByMe,
  subscribedBySenior,
  onClick,
}) => {
  const Toast = useToast({ position: "top-right" });
  const { payWithRazorpay } = useRazorpay();

  const [isLoading, setIsLoading] = useState(false);
  const [parentId, setParentId] = useState("");
  const [referralId, setReferralId] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("gateway");
  const [giftCard, setGiftCard] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (paymentMethod == "gateway") {
      setGiftCard("");
    }
  }, [paymentMethod]);

  function verifyUser(userId) {
    if (!userId) {
      Toast({
        description: "Please enter User ID",
      });
      return;
    }
    BackendAxios.get(`/api/users/${userId}`)
      .then((res) => {
        if (res.data?.length) {
          Toast({
            title: res.data[0]?.name,
            description: `Ph. ${res.data[0]?.phone_number || "NA"}`,
          });
        } else {
          Toast({
            description: "User not found!",
          });
        }
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  async function handlePayment() {
    await payWithRazorpay({
      amount: price,
      description: `Join ${title} at Virolife`,
      onSuccess: (trnxnId) => {
        handleClick(trnxnId);
      },
      onFail: () => {
        Toast({
          status: "error",
          title: "Payment Failed",
          description: "There was an error loading Razorpay checkout",
        });
      },
    });
  }

  async function handleClick(transactionId) {
    if (!parentId) return;
    if (paymentMethod == "gift" && !giftCard) {
      Toast({
        description: "Enter gift card number to proceed with payment.",
      });
      return;
    }
    if (
      parentId == localStorage.getItem("userId") ||
      referralId == localStorage.getItem("userId")
    ) {
      Toast({
        description: "You can not join yourself!",
      });
      return;
    }
    setIsLoading(true);
    await BackendAxios.post(`/api/subscription`, {
      planId: id,
      parentId: parentId,
      referralId: referralId,
      paymentMethod: paymentMethod,
      giftCard: giftCard,
      transactionId: transactionId,
    })
      .then((res) => {
        Toast({
          status: "success",
          description: `${title} purchased successfully`,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
        setIsLoading(false);
      })
      .finally(() => {
        onClose();
        onClick();
      });
  }

  return (
    <>
      <Box
        w={["full", "xs"]}
        bgColor={"#FFF"}
        border={"1px"}
        borderColor={"gray.200"}
        boxShadow={"md"}
      >
        <VStack p={4} bgColor={bgColor}>
          <Text
            color={color}
            textAlign={"center"}
            textTransform={"uppercase"}
            fontWeight={"bold"}
            fontSize={"2xl"}
          >
            {title}
          </Text>
          <Text
            color={color}
            textAlign={"center"}
            fontSize={"sm"}
            fontWeight={"semibold"}
          >
            Joining Fees ₹{price}
          </Text>
        </VStack>
        <Box>
          <Table size={"sm"}>
            <Tbody>
              {description?.map((content, key) => (
                <Tr key={key}>
                  <Td py={2} fontSize={"xs"}>
                    {content}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Box p={4}>
          {subscribedByMe ? (
            <Button
              w={"full"}
              bgColor={bgColor}
              _hover={{ bgColor: bgColor }}
              color={color}
            >
              Already Joined
            </Button>
          ) : (
            <Button
              w={"full"}
              bgColor={bgColor}
              _hover={{ bgColor: bgColor }}
              color={color}
              isLoading={isLoading}
              onClick={onOpen}
            >
              Join with ₹{price}
            </Button>
          )}
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>
            <Text>Enter Senior ID (required)</Text>
            <InputGroup>
              <InputLeftAddon children={"VCF"} />
              <Input
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                placeholder="Whom would you like to join?"
              />
              <InputRightAddon
                cursor={"pointer"}
                children={"Verify"}
                onClick={() => verifyUser(parentId)}
              />
            </InputGroup>
            <br />
            <br />
            <Text>Enter Referral ID (optional)</Text>
            <InputGroup>
              <InputLeftAddon children={"VCF"} />
              <Input
                value={referralId}
                onChange={(e) => setReferralId(e.target.value)}
                placeholder="Who referred you?"
              />
              <InputRightAddon
                cursor={"pointer"}
                children={"Verify"}
                onClick={() => verifyUser(referralId)}
              />
            </InputGroup>
            <br />
            <br />

            <Text
              textAlign={"center"}
              fontWeight={"semibold"}
              color={"twitter.500"}
            >
              {paymentMethod == "gateway"
                ? "You'll be paying through Razorpay Payment Gateway"
                : "Enter Gift Card No."}
            </Text>

            {paymentMethod === "gift" && (
              <HStack py={4} gap={4} w={"full"} justifyContent={"center"}>
                <PinInput otp onComplete={(value) => setGiftCard(value)}>
                  <PinInputField bgColor={"aqua"} />
                  <PinInputField bgColor={"aqua"} />
                  <PinInputField bgColor={"aqua"} />
                  <PinInputField bgColor={"aqua"} />
                  <PinInputField bgColor={"aqua"} />
                  <PinInputField bgColor={"aqua"} />
                </PinInput>
              </HStack>
            )}

            {paymentMethod == "gateway" ? (
              <Text
                textAlign={"center"}
                cursor={"pointer"}
                onClick={() => setPaymentMethod("gift")}
              >
                Click here if you have a Gift Card
              </Text>
            ) : (
              <Text
                textAlign={"center"}
                cursor={"pointer"}
                onClick={() => setPaymentMethod("gateway")}
              >
                Click here if you want to pay online
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="twitter"
              onClick={() => {
                if (paymentMethod == "gateway") {
                  handlePayment();
                } else {
                  handleClick();
                }
              }}
            >
              Join
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Plan;
