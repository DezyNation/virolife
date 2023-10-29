"use client";
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

const page = () => {
  const [data, setData] = useState([]);
  const { handleError } = useApiHandler();

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    BackendAxios.get(`/api/orders`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        handleError(err, "Error while fetching orders");
      });
  }

  return (
    <>
      <Text fontSize={"2xl"}>Ecommerce Orders</Text>
      <br />
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>Product</Th>
              <Th>Amount</Th>
              <Th>Shipping Address</Th>
              <Th>Ordered On</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((data, key) => (
              <Tr key={key}>
                <Td>{data?.id}</Td>
                <Td>{data?.product_name}</Td>
                <Td>{data?.amount}</Td>
                <Td>{data?.shipping_address}</Td>
                <Td>{data?.created_at}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default page;
