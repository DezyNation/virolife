"use client";
import React, { useEffect, useState } from "react";
import { Box, Stack, Text, Button, useToast, HStack } from "@chakra-ui/react";
import CampaignCard from "@/components/campaign/CampaignCard";
import { BsPlus } from "react-icons/bs";
import Link from "next/link";
import BackendAxios, { DefaultAxios } from "@/utils/axios";
import Footer from "@/components/global/Footer";
import Navbar from "@/components/global/Navbar";

const AllCampaigns = ({ showNavbar = true }) => {
  const Toast = useToast({ position: "top-right" });
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory == "all") {
      setFilteredCampaigns(campaigns);
    } else {
      setFilteredCampaigns(
        campaigns.filter(
          (campaign) => campaign?.category?.name == selectedCategory
        )
      );
    }
  }, [selectedCategory]);

  useEffect(() => {
    DefaultAxios.get("/api/product")
      .then((res) => {
        setCampaigns(res.data);
        setFilteredCampaigns(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }, []);

  function fetchCategories() {
    BackendAxios.get("/api/category")
      .then((res) => {
        setCategories(res.data);
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
      {showNavbar ? <Navbar /> : null}
      <Stack
        px={[4, 8, 16]}
        pt={[4, 8, 16]}
        direction={"row"}
        pb={4}
        justifyContent={"space-between"}
      >
        <Text className="serif" fontSize={"xl"} fontWeight={"semibold"} mb={0}>
          Redeem Your Points
        </Text>
      </Stack>
      <Stack
        alignItems={"center"}
        justifyContent={"flex-start"}
        direction={["column", "row"]}
      >
        <Text>Categories</Text>
        <HStack
          w={"full"}
          p={4}
          overflowX={"wrap"}
          alignItems={"center"}
          justifyContent={"flex-start"}
        >
          <Button
            minW={"16"}
            onClick={() => {
              setSelectedCategory("all");
            }}
            variant={selectedCategory == "all" ? "solid" : "ghost"}
            colorScheme="yellow"
            size={"sm"}
            rounded={"full"}
          >
            {"All"}
          </Button>
          {categories.map((category, key) => (
            <Button
              minW={"16"}
              onClick={() => {
                setSelectedCategory(category?.name);
              }}
              key={key}
              colorScheme="yellow"
              variant={selectedCategory == category?.name ? "solid" : "ghost"}
              size={"sm"}
              rounded={"full"}
              textTransform={"uppercase"}
            >
              {category.name}
            </Button>
          ))}
        </HStack>
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
        {filteredCampaigns
          .filter((item) => item.status === 1)
          .map((campaign, key) => (
            <CampaignCard
              key={key}
              coverImage={
                campaign?.images
                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${
                      JSON.parse(campaign?.images)[0]
                    }`
                  : "https://idea.batumi.ge/files/default.jpg"
              }
              category={campaign?.category?.name}
              title={campaign?.name}
              userName={
                campaign?.striked_price ? (
                  <>
                    <Text>
                      ₹{" "}
                      <s
                        style={{ textDecoration: "line-through", color: "red" }}
                      >
                        <span style={{ textDecoration: "none", color: "#000" }}>
                          {Number(campaign?.striked_price)?.toFixed(2)}
                        </span>
                      </s>{" "}
                      {campaign?.minimum_payable_amount || campaign?.price}
                    </Text>
                  </>
                ) : (
                  `₹ ${Number(campaign?.price)?.toLocaleString("en-IN")}`
                )
              }
              description={campaign?.description}
              link={`/store/${campaign?.id}`}
            />
          ))}
      </Stack>

      <Footer />
    </>
  );
};

export default AllCampaigns;
