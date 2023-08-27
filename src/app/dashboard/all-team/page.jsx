"use client";
import {
  Box,
  Button,
  Stack,
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
import React, { useState, useEffect } from "react";
import Lottie from "react-lottie";
import * as animationData from "../../../../public/star.json";
import BackendAxios from "@/utils/axios";
import Cookies from "js-cookie";

const page = () => {
  const Toast = useToast({ position: "top-right" });
  const [donations, setDonations] = useState([]);
  const [stars, setStars] = useState(0);

  useEffect(()=>{
    fetchVirolifeDonations()
    fetchMyInfo()
  },[])

  function fetchVirolifeDonations() {
    BackendAxios.get(`/api/donation/donate-virolife?purpose=all-team`)
      .then((res) => setDonations(res.data))
      .catch((err) => {
        if(err?.response?.status == 401){
          Cookies.remove("jwt")
          localStorage.clear()
          window.location.assign("/")
          return
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
      })
      .catch((err) => {
        if(err?.response?.status == 401){
          Cookies.remove("jwt")
          localStorage.clear()
          window.location.assign("/")
          return
        }
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
                <Th width={'64'}>Trnxn ID</Th>
                <Th>Amount</Th>
                <Th width={'48'}>Timestamp</Th>
              </Tr>
            </Thead>
            <Tbody>
              {donations?.map((item, key) => (
                <Tr key={key}>
                  <Td>{key + 1}</Td>
                  <Td width={'64'}>{item?.transaction_id}</Td>
                  <Td>{item?.amount}</Td>
                  <Td width={'48'}>{item?.updated_at}</Td>
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
            Stars Earned
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
            {stars}
          </Text>
          <br />
          <Button colorScheme={"yellow"}>
            Donate Now!
          </Button>
        </Box>
      </Stack>
    </>
  );
};

export default page;
