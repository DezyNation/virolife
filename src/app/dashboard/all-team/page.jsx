"use client";
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Lottie from "react-lottie";
import * as animationData from "../../../../public/star.json";
import BackendAxios from "@/utils/axios";
import Cookies from "js-cookie";
import useRazorpay from "@/utils/hooks/useRazorpay";

const page = () => {
  const Toast = useToast({ position: "top-right" });
  const { payWithRazorpay } = useRazorpay();

  const [donations, setDonations] = useState([]);
  const [stars, setStars] = useState(0);
  const [joinedOn, setJoinedOn] = useState("");
  const [performance, setPerformance] = useState(0);

  const { isOpen, onToggle } = useDisclosure();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [giftCard, setGiftCard] = useState("");

  useEffect(() => {
    fetchVirolifeDonations();
    fetchMyInfo();
  }, []);

  useEffect(() => {
    if (paymentMethod == "gateway") {
      setGiftCard("");
    }
  }, [paymentMethod]);

  function getMonthsBetweenDates(joiningDate) {
    const startDate = new Date(joiningDate);
    const endDate = new Date();
    var startYear = startDate.getFullYear();
    var startMonth = startDate.getMonth();
    var endYear = endDate.getFullYear();
    var endMonth = endDate.getMonth();

    return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
  }

  function fetchVirolifeDonations() {
    BackendAxios.get(`/api/user/donation/donate-virolife?purpose=all-team`)
      .then((res) => setDonations(res.data))
      .catch((err) => {
        if (err?.response?.status == 401) {
          Cookies.remove("jwt");
          localStorage.clear();
          window.location.assign("/");
          return;
        }
        Toast({
          status: "error",
          title: "Error while fetching donations",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function fetchMyInfo() {
    BackendAxios.get("/auth-user")
      .then((res) => {
        setStars(res?.data[0]?.stars);
        setJoinedOn(res?.data[0]?.created_at);
        setPerformance(res?.data[0]?.performance);
        // const monthDiff = getMonthsBetweenDates(res?.data[0]?.created_at);
        // setPerformance((Number(res?.data[0]?.stars) / monthDiff));
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          Cookies.remove("jwt");
          localStorage.clear();
          window.location.assign("/");
          return;
        }
        Toast({
          status: "error",
          title: "Error while fetching donations",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  async function handlePayment() {
    payWithRazorpay({
      amount: 210,
      onSuccess: (trnxnId) => {
        donate(trnxnId);
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

  function donate(transactionId) {
    BackendAxios.post(`/api/gift/redeem/viroteam`, {
      purpose: "all-team",
      code: giftCard,
      amount: 210,
      paymentMethod: paymentMethod,
      transactionId: transactionId,
    })
      .then((res) => {
        onToggle();
        fetchVirolifeDonations();
        Toast({
          status: "success",
          description: "Donated successfully!",
        });
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Error while fetching donations",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  return (
    <>
      <Text fontSize={"lg"}>All Team Processing</Text>
      <br />
      <Stack
        direction={["column", "row"]}
        alignItems={["center", "flex-start"]}
        justifyContent={"space-between"}
        gap={8}
      >
        <TableContainer>
          <Table size={"sm"}>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th width={"64"}>Trnxn ID</Th>
                <Th>Amount</Th>
                <Th>Stars</Th>
                <Th width={"48"}>Timestamp</Th>
              </Tr>
            </Thead>
            <Tbody>
              {donations?.map((item, key) => (
                <Tr key={key}>
                  <Td>{key + 1}</Td>
                  <Td width={"64"}>{item?.transaction_id}</Td>
                  <Td>{item?.amount}</Td>
                  <Td>20</Td>
                  <Td width={"48"}>{item?.updated_at}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Box
          p={4}
          rounded={4}
          boxShadow={"lg"}
          border={"1px"}
          borderColor={"#DADADA"}
        >
          <Text fontWeight={"medium"} textAlign={"center"}>
            Star Performance
          </Text>
          <Lottie
            options={{
              animationData: animationData,
              loop: true,
              autoplay: true,
            }}
            width={200}
            height={200}
          />
          <Text fontWeight={"bold"} fontSize={"2xl"} textAlign={"center"}>
            {performance?.toFixed(2)}
          </Text>
          <br />
          <Button colorScheme={"yellow"} w={"full"} onClick={onToggle}>
            Donate Now!
          </Button>
        </Box>
      </Stack>

      <Modal isOpen={isOpen} onClose={onToggle} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select payment method!</ModalHeader>
          <ModalBody>
            {paymentMethod == "giftCard" ? (
              <Box pt={16}>
                <Text textAlign={"center"}>Enter Gift PIN</Text>
                <HStack w={"full"} justifyContent={"center"} gap={4}>
                  <PinInput otp onComplete={(value) => setGiftCard(value)}>
                    <PinInputField bgColor={"gray.100"} />
                    <PinInputField bgColor={"gray.100"} />
                    <PinInputField bgColor={"gray.100"} />
                    <PinInputField bgColor={"gray.100"} />
                    <PinInputField bgColor={"gray.100"} />
                    <PinInputField bgColor={"gray.100"} />
                  </PinInput>
                </HStack>
              </Box>
            ) : "You will be paying with Razorpay Payment Gateway"}
          </ModalBody>
          <ModalFooter justifyContent={"flex-end"} gap={8}>
            {paymentMethod == "gateway" ? (
              <Text
                color={"blue.600"}
                onClick={() => setPaymentMethod("giftCard")}
                cursor={"pointer"}
                fontWeight={"semibold"}
              >
                Pay with Gift PIN
              </Text>
            ) : (
              <Text
                color={"blue.600"}
                onClick={() => setPaymentMethod("gateway")}
                cursor={"pointer"}
                fontWeight={"semibold"}
              >
                Pay with PhonePe
              </Text>
            )}
            <Button
              colorScheme="yellow"
              onClick={() => {
                if (paymentMethod == "gateway") {
                  handlePayment();
                } else {
                  donate();
                }
              }}
            >
              Donate
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default page;
