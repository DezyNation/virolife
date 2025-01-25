"use client";
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { BsCurrencyRupee } from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi";

const Commission = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { handleError } = useApiHandler();
  const Toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [points, setPoints] = useState({
    atpPoints: 0,
    healthPoints: 0,
    adPoints: 0,
    cashPoints: 0,
  });
  const [myRole, setMyRole] = useState("");
  const [commission, setCommission] = useState("");

  useEffect(() => {
    setMyRole(localStorage.getItem("myRole"));
    fetchInfo();
  }, []);

  useEffect(() => {
    localStorage.setItem("atpPoints", points.atpPoints);
    localStorage.setItem("healthPoints", points.healthPoints);
    localStorage.setItem("adPoints", points.adPoints);
    localStorage.setItem("cashPoints", points.cashPoints);
  }, [
    points.atpPoints,
    points.healthPoints,
    points.adPoints,
    points.cashPoints,
  ]);

  async function fetchInfo() {
    try {
      setIsLoading(true);
      await BackendAxios.get("/auth-user").then(async (res) => {
        setMyRole(
          res.data[0]?.roles?.length ? res.data[0]?.roles[0]?.name : ""
        );
        setCommission(res.data[0]?.wallet);
      });
      await BackendAxios.get(`/api/my-health-points`).then((result) => {
        setPoints({
          healthPoints: result.data,
        });
      });
      await BackendAxios.get(`/api/my-cash-points`).then((res) => {
        setPoints((prev) => ({
          ...prev,
          cashPoints: res.data?.total_points - res.data?.redeemed_points,
        }));
      });
    } catch (err) {
      handleError(err, "Error while loading your points");
    } finally {
      setIsLoading(false);
    }
  }

  const Formik = useFormik({
    initialValues: {
      amount: "",
      remarks: "",
    },
    onSubmit: (values) => {
      BackendAxios.post(`/api/user/commission-request`, values)
        .then((res) => {
          Toast({
            status: "success",
            title: "Request Sent",
            description: "We have sent a payout request to the admin!",
          });
          onToggle();
        })
        .catch((err) => {
          handleError(err, "Notification while sending request");
        });
    },
  });

  return (
    <>
      <HStack
        gap={6}
        alignItems={"center"}
        w={"full"}
        justifyContent={"flex-end"}
      >
        <IconButton
          icon={<FiRefreshCw size={20} />}
          rounded={"full"}
          onClick={fetchInfo}
          isLoading={isLoading}
        />

        <HStack
          rounded={"full"}
          gap={0}
          bgColor={"gray.50"}
          onClick={() =>
            (window.location.href = "/dashboard/cash-points/withdrawals")
          }
        >
          <IconButton
            bgColor={"pink.400"}
            color={"#FFF"}
            icon={<BsCurrencyRupee size={20} />}
            rounded={"full"}
          />
          <Box p={2}>
            <Text fontSize={"8"}>Cash Points</Text>
            <Text fontSize={"md"} fontWeight={"semibold"}>
              {Number(points.cashPoints)?.toFixed(2)}
            </Text>
          </Box>
        </HStack>

        {myRole == "agent" && (
          <HStack rounded={"full"} gap={0} bgColor={"gray.50"}>
            <IconButton
              bgColor={"red.400"}
              color={"#FFF"}
              icon={<AiFillHeart size={20} />}
              rounded={"full"}
            />
            <Box p={2}>
              <Text fontSize={"8"}>Health Points</Text>
              <Text fontSize={"md"} fontWeight={"semibold"}>
                {points.healthPoints}
              </Text>
            </Box>
          </HStack>
        )}

        <HStack rounded={"full"} gap={0} bgColor={"gray.50"}>
          <IconButton
            bgColor={"yellow.500"}
            color={"#FFF"}
            icon={<BsCurrencyRupee size={20} />}
            rounded={"full"}
            onClick={onToggle}
          />
          <Box p={2}>
            <Text fontSize={"8"}>Commission</Text>
            <Text fontSize={"md"} fontWeight={"semibold"}>
              {commission}
            </Text>
          </Box>
        </HStack>
      </HStack>

      {/* Handle payout request for commission */}
      <Modal isOpen={isOpen} onClose={onToggle} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request Payout</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Enter Amount</FormLabel>
              <Input name="amount" onChange={Formik.handleChange} />
            </FormControl>
            <br />
            <br />
            <FormControl>
              <FormLabel>Remarks (optional)</FormLabel>
              <Input name="remarks" onChange={Formik.handleChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={"flex-end"} gap={8}>
              <Button onClick={onToggle}>Cancel</Button>
              <Button colorScheme="yellow" onClick={Formik.handleSubmit}>
                Submit
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Commission;
