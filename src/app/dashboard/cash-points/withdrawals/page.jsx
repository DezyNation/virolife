"use client";
import BackendAxios from "@/utils/axios";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const page = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast({ position: "top" });
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    (() => {
      BackendAxios.get(`/api/cash-points`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          toast({
            status: "error",
            description: err?.response?.data?.message || err?.message,
          });
        });
    })();
  }, []);

  async function handleWithdrawalRequest() {
    if (amount > localStorage.getItem("cashPoints")) {
      alert(
        "You can only withdraw upto ₹" + localStorage.getItem("cashPoints")
      );
      return;
    }
    setIsLoading(true);
    BackendAxios.post("/api/cash-points", { points: amount })
      .then((res) => {
        toast({
          status: "success",
          description: "Request submitted successfully!",
        });
        onClose();
      })
      .catch((err) => {
        onClose();
        toast({
          status: "error",
          description: err?.response?.data?.message || err?.message,
        });
      });
    setIsLoading(false);
  }

  return (
    <>
      <HStack justifyContent={"space-between"}>
        <h1>Cash Points Withdrawals</h1>
        <Button colorScheme="twitter" onClick={onOpen}>
          New Request
        </Button>
      </HStack>
      <br />
      <br />
      <Table>
        <Thead>
          <Tr>
            <Th>Req ID</Th>
            <Th>Amount</Th>
            <Th>Created At</Th>
            <Th>Status</Th>
            <Th>Updated At</Th>
            <Th>Remarks</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((item, key) => (
            <Tr key={key}>
              <Td>{item.id}</Td>
              <Td>{item.amount}</Td>
              <Td>{item.created_at}</Td>
              <Td>{item.status}</Td>
              <Td>{item.updated_at}</Td>
              <Td>{item.remarks}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cash Points Withdrawal</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Enter amount you want to withdraw</FormLabel>
              <Input
                max={localStorage.getItem("cashPoints")}
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={"flex-end"}>
              <Button isLoading={isLoading} onClick={handleWithdrawalRequest}>
                Submit
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default page;
