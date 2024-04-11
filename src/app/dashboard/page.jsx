"use client";
import React, { useEffect, useState } from "react";
import { Text, Stack, Box, useToast } from "@chakra-ui/react";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  BsArrowRight,
  BsCashCoin,
  BsCurrencyRupee,
  BsMegaphoneFill,
} from "react-icons/bs";
import { isExpired } from "react-jwt";
import BackendAxios from "@/utils/axios";
import { MdGroups } from "react-icons/md";
import Cookies from "js-cookie";
import useAuth from "@/utils/hooks/useAuth";

const DashboardHome = () => {
  const Toast = useToast();
  const { fetchMyInfo, authUser, myRole } = useAuth();
  const [sessionExpired, setSessionExpired] = useState(false);

  const [primaryJuniors, setPrimaryJuniors] = useState([]);
  const [secondaryJuniors, setSecondaryJuniors] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [collections, setCollections] = useState(null);

  const [msg, setMsg] = useState("");

  useEffect(() => {
    setSessionExpired(isExpired(Cookies.get("jwt")));
  }, [Cookies.get()]);

  useEffect(() => {
    fetchMyInfo();
  }, []);

  useEffect(() => {
    fetchCollections();
    fetchCampaigns();
  }, []);

  useEffect(() => {
    fetchPrimaryGroup();
    fetchSecondaryGroup();
  }, []);

  useEffect(() => {
    BackendAxios.get(`/api/content`)
      .then((res) => {
        const parsedData = JSON.parse(res.data[0]?.content);
        setMsg(parsedData?.memberBroadcast);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }, []);

  function fetchCollections() {
    BackendAxios.get(`/api/total-donation`)
      .then((res) => {
        setCollections(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Notification while fetching total collection",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function fetchPrimaryGroup() {
    BackendAxios.get(`/api/my-group`)
      .then((res) => {
        setPrimaryJuniors(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function fetchSecondaryGroup() {
    BackendAxios.get(`/api/my-group/secondary`)
      .then((res) => {
        setSecondaryJuniors(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function fetchCampaigns() {
    BackendAxios.get("/api/user-campaigns")
      .then((res) => {
        setCampaigns(res.data?.filter((data) => data?.status == "approved"));
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  if (sessionExpired) {
    return (
      <>
        <Text>Session expired! Please login to view this page</Text>
      </>
    );
  }

  return (
    <>
      <Text
        className="serif"
        fontSize={"xl"}
        py={4}
        textTransform={"capitalize"}
      >
        Welcome, {authUser?.name} - ({process.env.NEXT_PUBLIC_CODE}
        {authUser?.id})
      </Text>
      {myRole == "user" ? (
        <Stack
          w={"full"}
          direction={["column", "row"]}
          gap={[8, 16]}
          justifyContent={"space-between"}
        >
          <StatsCard
            icon={<MdGroups size={28} />}
            title={"my team"}
            quantity={primaryJuniors?.length + secondaryJuniors?.length}
          />

          <StatsCard
            icon={<BsMegaphoneFill size={28} />}
            title={"active campaigns"}
            quantity={campaigns?.length}
          />
          <StatsCard
            icon={<BsCurrencyRupee size={28} />}
            title={"primary collection"}
            quantity={collections?.primary}
          />
          <StatsCard
            icon={<BsCurrencyRupee size={28} />}
            title={"secondary collection"}
            quantity={collections?.secondary}
          />
        </Stack>
      ) : (
        <Stack
          w={"full"}
          direction={["column", "row"]}
          gap={[8, 16]}
          justifyContent={"space-between"}
        >
          <StatsCard icon={<MdGroups size={28} />} title={"users created"} />
          <StatsCard
            icon={<BsCurrencyRupee size={28} />}
            title={"pending commision"}
          />
          <StatsCard
            icon={<BsCashCoin size={28} />}
            title={"commission settled"}
          />
        </Stack>
      )}

      {msg ? (
        <Box
          mt={16}
          p={4}
          bgColor={"yellow.50"}
          border={"1px solid"}
          borderColor={"yellow.300"}
          rounded={4}
        >
          <Text fontWeight={"semibold"}>Important Message: </Text>
          <Text>{msg}</Text>
        </Box>
      ) : null}
    </>
  );
};

export default DashboardHome;
