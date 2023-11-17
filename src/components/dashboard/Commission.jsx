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
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { BsCurrencyRupee } from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi";

const Commission = ({ onClick, commission }) => {
  const { isOpen, onToggle } = useDisclosure();
  const { handleError } = useApiHandler();
  const Toast = useToast();

  const Formik = useFormik({
    initialValues: {
      amount: "",
      remarks: "",
    },
    onSubmit: (values) => {
      BackendAxios.post(`/api/user/commission-request`, {
        ...values,
        useRemarks: values.remarks,
      })
        .then((res) => {
          Toast({
            status: "success",
            title: "Request Sent",
            description: "We have sent a payout request to the admin!",
          });
          onToggle();
        })
        .catch((err) => {
          handleError(err, "Error while sending request");
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
          onClick={onClick}
        />
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
