"use client";
import Carousel from "@/components/home/Carousel";
import AllCampaigns from "./campaigns/page";
import Footer from "@/components/global/Footer";
import Navbar from "@/components/global/Navbar";
import { useEffect, useState } from "react";
import BackendAxios from "@/utils/axios";
import { Box, Text } from "@chakra-ui/react";

export default function Home() {
  const [visits, setVisits] = useState({ today: "", total: "" });
  useEffect(() => {
    addVisit();
  }, []);
  function addVisit() {
    BackendAxios.post(`/api/visit`)
      .then((res) => {
        fetchVisits();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function fetchVisits() {
    BackendAxios.get(`/api/visit`)
      .then((res) => {
        setVisits({
          today: res.data?.today,
          total: res.data?.total,
        });
      })
      .catch((err) => {});
  }

  return (
    <>
      <Navbar />
      <Carousel />
      <AllCampaigns showNavbar={false} />
      <Box pos={'fixed'} bottom={'4'} left={'4'} p={4} bgColor={'yellow.300'}>
        <Text fontSize={'xs'}>Today's Visits</Text>
        <Text fontSize={'sm'} fontWeight={'semibold'}>{visits.today}</Text>
        <Text fontSize={'xs'}>Total Visits</Text>
        <Text fontSize={'sm'} fontWeight={'semibold'}>{visits.total}</Text>
      </Box>
    </>
  );
}
