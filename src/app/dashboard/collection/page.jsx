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
} from "@chakra-ui/react";

const page = () => {
  const [transactions, setTransactions] = useState([1]);
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
                <Td>1234</Td>
                <Td>Sagar</Td>
                <Td>Transaction for Group Funding</Td>
                <Td>₹ 200</Td>
                <Td>{new Date().toLocaleDateString()}</Td>
                <Td>
                  <HStack>
                    <Button size={"sm"} rounded={"full"} colorScheme="yellow">
                      Confirm
                    </Button>
                    <Button size={"sm"} rounded={"full"} colorScheme="red">
                      Delete
                    </Button>
                  </HStack>
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
