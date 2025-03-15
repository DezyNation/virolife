"use client";
import React, { useEffect, useState } from "react";
import {
  Stack,
  Box,
  Text,
  Show,
  VStack,
  HStack,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import Link from "next/link";
import { AiFillDashboard, AiFillHeart, AiFillYoutube } from "react-icons/ai";
import {
  BsCashCoin,
  BsClipboardDataFill,
  BsCurrencyRupee,
  BsFill1CircleFill,
  BsGiftFill,
  BsHeartFill,
  BsMegaphoneFill,
  BsPercent,
  BsPerson,
  BsPersonFill,
  BsPower,
  BsWalletFill,
} from "react-icons/bs";
import { MdGroups, MdSlowMotionVideo } from "react-icons/md";
import {
  FaHandshake,
  FaMoneyBill,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";
import { GiChestnutLeaf, GiReceiveMoney } from "react-icons/gi";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { isExpired } from "react-jwt";
import BackendAxios from "@/utils/axios";
import Cookies from "js-cookie";
import Navbar from "@/components/global/Navbar";
import Points from "@/components/dashboard/Points";
import Commission from "@/components/dashboard/Commission";
import { HiArrowsRightLeft } from "react-icons/hi2";
import { BiDonateHeart } from "react-icons/bi";
import { PiTargetFill } from "react-icons/pi";

const Layout = ({ children }) => {
  const Toast = useToast({ position: "top-right" });
  const Router = useRouter();
  const [myRole, setMyRole] = useState("");
  const [commission, setCommission] = useState("");

  const [idStatus, setIdStatus] = useState({
    primary: false,
    secondary: false,
  });

  useEffect(() => {
    isExpired(Cookies.get("jwt"));
    setIdStatus({
      primary: localStorage.getItem("primaryActive"),
      secondary: localStorage.getItem("secondaryActive"),
    });
  }, []);

  async function handleLogout() {
    await BackendAxios.post("/logout")
      .then((res) => {
        // removeCookie("jwt")
        Cookies.remove("jwt");
        localStorage.clear();
      })
      .catch((err) => {
        // removeCookie("jwt")
        Cookies.remove("jwt");
        localStorage.clear();
        Router.replace("/");
      })
      .finally(() => {
        Router.replace("/");
      });
  }

  useEffect(() => {
    setMyRole(localStorage.getItem("myRole"));
  }, []);

  useEffect(() => {
    fetchInfo();
  }, []);

  function fetchInfo() {
    BackendAxios.get("/auth-user")
      .then((res) => {
        setMyRole(
          res.data[0]?.roles?.length ? res.data[0]?.roles[0]?.name : ""
        );
        setCommission(res.data[0]?.wallet);
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          handleLogout();
          return;
        }
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  return (
    <>
      <Navbar />
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Show above="md">
          <Box p={4} bg={"blanchedalmond"} w={"xs"}>
            <Text className="serif" fontSize={"xl"} fontWeight={"semibold"}>
              Virolife
            </Text>

            <VStack w={"full"} gap={0} pt={8} alignItems={"flex-start"}>
              <Link style={{ width: "100%" }} href={"/dashboard/profile"}>
                <HStack
                  p={2}
                  _hover={{ bgColor: "orange.200" }}
                  w={"full"}
                  gap={4}
                >
                  <BsPersonFill size={20} />
                  <Text>Profile</Text>
                  <Box
                    p={2}
                    bgColor={Boolean(Number(idStatus?.primary)) ? "whatsapp.400" : "red.500"}
                    rounded={"full"}
                    fontSize={"xs"}
                  >
                    P
                  </Box>
                  <Box
                    p={2}
                    bgColor={Boolean(Number(idStatus?.secondary)) ? "whatsapp.400" : "red.500"}
                    rounded={"full"}
                    fontSize={"xs"}
                  >
                    S
                  </Box>
                </HStack>
              </Link>
              <Link style={{ width: "100%" }} href={"/dashboard"}>
                <HStack
                  p={2}
                  _hover={{ bgColor: "orange.200" }}
                  w={"full"}
                  gap={4}
                >
                  <AiFillDashboard size={20} />
                  <Text>Dashboard</Text>
                </HStack>
              </Link>
              {myRole == "user" ? (
                <VStack w={"full"} gap={0} pt={8} alignItems={"flex-start"}>
                  <Link style={{ width: "100%" }} href={"/dashboard/campaigns"}>
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <BsMegaphoneFill size={20} />
                      <Text>My Campaigns</Text>
                    </HStack>
                  </Link>
                  <Link
                    style={{ width: "100%" }}
                    href={"/dashboard/campaigns/withdrawal-requests"}
                  >
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <FaMoneyBill size={20} />
                      <Text>Campaign Withdrawals</Text>
                    </HStack>
                  </Link>
                  <Link
                    style={{ width: "100%" }}
                    href={"/dashboard/collection"}
                  >
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <BsCurrencyRupee size={20} />
                      <Text>Collection</Text>
                    </HStack>
                  </Link>
                  <Link
                    style={{ width: "100%" }}
                    href={"/dashboard/cash-points/withdrawals"}
                  >
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <BsCurrencyRupee size={20} />
                      <Text>Cash Point Withdrawals</Text>
                    </HStack>
                  </Link>
                  <Link style={{ width: "100%" }} href={"/dashboard/groups"}>
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <MdGroups size={20} />
                      <Text>Groups</Text>
                    </HStack>
                  </Link>
                  <Link style={{ width: "100%" }} href={"/dashboard/target"}>
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <PiTargetFill size={20} />
                      <Text>Target List</Text>
                    </HStack>
                  </Link>
                  <Link
                    style={{ width: "100%" }}
                    href={"/dashboard/team-funding"}
                  >
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <GiChestnutLeaf size={20} />
                      <Text>Viro Team Funding</Text>
                    </HStack>
                  </Link>
                  <Link style={{ width: "100%" }} href={"/dashboard/all-team"}>
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <FaHandshake size={20} />
                      <Text>All Team Processing</Text>
                    </HStack>
                  </Link>
                  <br />
                  <Link
                    style={{ width: "100%" }}
                    href={"/dashboard/gift-cards"}
                  >
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <BsGiftFill size={20} />
                      <Text>Gift Cards</Text>
                    </HStack>
                  </Link>
                  <Link
                    style={{ width: "100%" }}
                    href={"/dashboard/points/transfers"}
                  >
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <HiArrowsRightLeft size={20} />
                      <Text>Point Transfers</Text>
                    </HStack>
                  </Link>
                  {/* <Link style={{width: '100%'}} href={"/dashboard/points/withdrawals"}>
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <GiReceiveMoney size={20} />
                      <Text>Point Withdrawals</Text>
                    </HStack>
                  </Link> */}
                  <br />
                  <Link
                    style={{ width: "100%" }}
                    href={"/dashboard/campaign-donations"}
                  >
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <BiDonateHeart size={20} />
                      <Text>Campaign Donations</Text>
                    </HStack>
                  </Link>
                  <Link style={{ width: "100%" }} href={"/dashboard/orders"}>
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <FaShoppingCart size={20} />
                      <Text>Ecom Orders</Text>
                    </HStack>
                  </Link>
                  <Link
                    style={{ width: "100%" }}
                    href={"/dashboard/transactions"}
                  >
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <BsClipboardDataFill size={20} />
                      <Text>Transactions</Text>
                    </HStack>
                  </Link>
                </VStack>
              ) : (
                <VStack w={"full"} gap={4} pt={8} alignItems={"flex-start"}>
                  <Link style={{ width: "100%" }} href={"/dashboard/users"}>
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <FaUsers size={20} />
                      <Text>Manage Users</Text>
                    </HStack>
                  </Link>
                  <Link
                    style={{ width: "100%" }}
                    href={"/dashboard/gift-cards"}
                  >
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <BsGiftFill size={20} />
                      <Text>Gift Cards</Text>
                    </HStack>
                  </Link>
                  <Link style={{ width: "100%" }} href={"/dashboard/payouts"}>
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <BsWalletFill size={20} />
                      <Text>Payouts</Text>
                    </HStack>
                  </Link>
                  <Link
                    style={{ width: "100%" }}
                    href={"/dashboard/campaign-commission"}
                  >
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <BsPercent size={20} />
                      <Text>Campaign Commission</Text>
                    </HStack>
                  </Link>

                  <Link
                    style={{ width: "100%" }}
                    href={"/dashboard/cash-points/withdrawals"}
                  >
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <BsCurrencyRupee size={20} />
                      <Text>Cash Point Withdrawals</Text>
                    </HStack>
                  </Link>

                  <Link
                    style={{ width: "100%" }}
                    href={"/dashboard/team-funding"}
                  >
                    <HStack
                      p={2}
                      _hover={{ bgColor: "orange.200" }}
                      w={"full"}
                      gap={4}
                    >
                      <BsCurrencyRupee size={20} />
                      <Text>Cash Points</Text>
                    </HStack>
                  </Link>
                </VStack>
              )}

              <HStack
                p={2}
                _hover={{ bgColor: "orange.200" }}
                w={"full"}
                marginTop={16}
                gap={4}
                onClick={handleLogout}
                cursor={"pointer"}
              >
                <BsPower size={20} />
                <Text>Log Out</Text>
              </HStack>
            </VStack>
          </Box>
        </Show>
        <Box
          p={[4, 8, 8]}
          w={"full"}
          height={"100vh"}
          overflowY={"scroll"}
          className="hide-scrollbar"
        >
          {myRole == "user" ? (
            <Points />
          ) : (
            <Commission />
          )}
          {children}
        </Box>
      </Stack>
    </>
  );
};

export default Layout;
