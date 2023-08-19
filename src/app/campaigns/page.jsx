"use client";
import React, { useEffect, useState } from "react";
import { Box, Stack, Text, Button, useToast } from "@chakra-ui/react";
import CampaignCard from "@/components/campaign/CampaignCard";
import { BsPlus } from "react-icons/bs";
import Link from "next/link";
import BackendAxios, { DefaultAxios } from "@/utils/axios";
import Footer from "@/components/global/Footer";
import Navbar from "@/components/global/Navbar";

const AllCampaigns = ({ showNavbar = true }) => {
  const Toast = useToast({ position: "top-right" });
  const [campaigns, setCampaigns] = useState([]);
  useEffect(() => {
    DefaultAxios.get("/api/campaign")
      .then((res) => {
        setCampaigns(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }, []);

  return (
    <>
      {showNavbar ? <Navbar /> : null}
      <Stack
        px={[4, 8, 16]}
        pt={[4, 8, 16]}
        direction={"row"}
        pb={4}
        justifyContent={"space-between"}
      >
        <Text className="serif" fontSize={"xl"} fontWeight={"semibold"} mb={0}>
          Contribute in Ongoing Campaigns
        </Text>
      </Stack>
      <Stack
        direction={["column", "row"]}
        flexWrap={"wrap"}
        gap={[16, 8, 16]}
        justifyContent={"center"}
        alignItems={"flex-start"}
        minH={"85vh"}
        pt={4}
        px={[4, 8, 16]}
        pb={[4, 8, 16]}
      >
        {campaigns
          .filter((item) => item.status == "approved")
          .map((campaign, key) => (
            <CampaignCard
              key={key}
              coverImage={
                campaign?.file_path
                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${JSON.parse(campaign?.file_path)[0]}`
                  : "https://idea.batumi.ge/files/default.jpg"
              }
              category={campaign?.category?.name}
              title={campaign.title}
              userName={`Need ₹ ${Number(
                campaign?.target_amount
              )?.toLocaleString("en-IN")}`}
              description={campaign.description}
              link={`/campaigns/${campaign.id}`}
            />
          ))}
      </Stack>

      <Footer />
    </>
  );
};

export default AllCampaigns;
