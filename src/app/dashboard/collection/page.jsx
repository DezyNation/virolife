"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import BackendAxios from "@/utils/axios";

const page = () => {
  const [transactions, setTransactions] = useState([]);
  const Toast = useToast({
    position: "top-right",
  });

  function fetchMyCollections() {
    BackendAxios.get(`/api/my-collections`)
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  useEffect(() => {
    fetchMyCollections();
  }, []);

  function approveDonation(id) {
    if (!id) return;
    BackendAxios.post(`/api/approve-donation/${id}`,{status: 1})
      .then((res) => {
        Toast({
          status: "success",
          description: "Donation approved",
        });
        fetchMyCollections()
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function deleteDonation(id) {
    if (!id) return;
    BackendAxios.delete(`/api/donation/${id}`)
      .then((res) => {
        Toast({
          description: "Donation deleted",
        });
        fetchMyCollections()
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  return (
    <>
      <Text fontSize={["2xl", "3xl"]}>Your Collection</Text>
      <br />
      <TableContainer>
        <Table variant={"striped"} colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Trnxn ID</Th>
              <Th>From</Th>
              <Th>Description</Th>
              <Th>Amount</Th>
              <Th>Timestamp</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((item, key) => (
              <Tr key={key}>
                <Td>{item?.id}</Td>
                <Td>{item?.user?.name}</Td>
                <Td>{item?.remarks}</Td>
                <Td>₹ {item?.amount}</Td>
                <Td>{new Date(item?.created_at).toLocaleDateString()}</Td>
                <Td>
                  {!item?.approved && !item?.deleted_at ? (
                    <HStack>
                      <Button
                        size={"sm"}
                        rounded={"full"}
                        colorScheme="yellow"
                        onClick={() => approveDonation(item.id)}
                      >
                        Confirm
                      </Button>
                      <Button
                        size={"sm"}
                        rounded={"full"}
                        colorScheme="red"
                        onClick={() => deleteDonation(item.id)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  ) : null}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default page;
