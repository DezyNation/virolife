"use client";
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";
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
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

const Earnings = () => {
  const [data, setData] = useState([]);
  const { handleError } = useApiHandler();

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    BackendAxios.get(`api/my-campaign-commission`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        handleError(err, "Error while fetching previous requests");
      });
  }

  return (
    <>
      <TableContainer>
        <Table>
          <Thead>
            <Th>#</Th>
            <Th>Campaign</Th>
            <Th>Amount</Th>
            <Th>Timestamp</Th>
          </Thead>
          <Tbody>
          {data?.map((item, key) => (
              <Tr key={key}>
                <Td>{item?.id}</Td>
                <Td>{item?.campaign_name}</Td>
                <Td>{item?.commission}</Td>
                <Td>{item?.created_at}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

const Withdrawals = () => {
  const [data, setData] = useState([]);
  const { handleError } = useApiHandler();

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    BackendAxios.get(`api/campaign-commission-withdrawal`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        handleError(err, "Error while fetching previous requests");
      });
  }

  return (
    <>
      <TableContainer>
        <Table>
          <Thead>
            <Th>#</Th>
            <Th>Amount</Th>
            <Th>Status</Th>
            <Th>Timestamp</Th>
          </Thead>
          <Tbody>
            {data?.map((item, key) => (
              <Tr key={key}>
                <Td>{item?.id}</Td>
                <Td>{item?.commission}</Td>
                <Td>{item?.status}</Td>
                <Td>{item?.created_at}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

const page = () => {
  const Toast = useToast();
  const { handleError } = useApiHandler();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amount, setAmount] = useState("");

  function submitWithdrawalRequest() {
    BackendAxios.post(`api/campaign-commission-withdrawal`, {
      commission: amount,
    })
      .then((res) => {
        Toast({
          status: "success",
          description: "Withdrawal request submitted successfully!",
        });
        onClose();
      })
      .catch((err) => {
        handleError(err, "Error while submitting request");
      });
  }

  return (
    <>
      <Text fontSize={["2xl", "3xl"]}>Campaign Commission</Text>
      <br />
      <br />
      <Text>Earnings</Text>
      <Earnings />
      <br />
      <br />
      <Text>Withdrawals</Text>
      <Withdrawals />

      <Button
        colorScheme="twitter"
        rounded={"full"}
        pos={"fixed"}
        bottom={4}
        right={4}
        onClick={onOpen}
      >
        Withdraw Amount
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New withdrawal request</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Amount</FormLabel>
              <Input
                placeholder="₹"
                name="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={"flex-end"} gap={4}>
              <Button onClick={onClose}>Cancel</Button>
              <Button colorScheme="twitter" onClick={submitWithdrawalRequest}>
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
