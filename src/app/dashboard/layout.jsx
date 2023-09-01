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
  BsCurrencyRupee,
  BsFill1CircleFill,
  BsHeartFill,
  BsMegaphoneFill,
  BsPerson,
  BsPersonFill,
  BsPower,
} from "react-icons/bs";
import { MdGroups, MdSlowMotionVideo } from "react-icons/md";
import { FaHandshake, FaUsers } from "react-icons/fa";
import { GiChestnutLeaf } from "react-icons/gi";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { isExpired } from "react-jwt";
import BackendAxios from "@/utils/axios";
import Cookies from "js-cookie";
import Navbar from "@/components/global/Navbar";

const Layout = ({ children }) => {
  const Toast = useToast({ position: "top-right" });
  const Router = useRouter();
  const [myRole, setMyRole] = useState("");

  useEffect(() => {
    isExpired(Cookies.get("jwt"));
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
      });
    Router.replace("/");
  }

  useEffect(() => {
    setMyRole(localStorage.getItem("myRole"));
  }, []);

  return (
    <>
      <Navbar />
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Show above="md">
          <Box p={4} bg={"blanchedalmond"} w={"xs"}>
            <Text className="serif" fontSize={"xl"} fontWeight={"semibold"}>
              Virolife
            </Text>

            <VStack w={"full"} gap={4} pt={8} alignItems={"flex-start"}>
              <Link href={"/auth/info"}>
                <HStack gap={4}>
                  <BsPersonFill size={20} />
                  <Text>Profile</Text>
                </HStack>
              </Link>
              <Link href={"/dashboard"}>
                <HStack gap={4}>
                  <AiFillDashboard size={20} />
                  <Text>Dashboard</Text>
                </HStack>
              </Link>
              <Link href={"/dashboard/campaigns"}>
                <HStack gap={4}>
                  <BsMegaphoneFill size={20} />
                  <Text>My Campaigns</Text>
                </HStack>
              </Link>
              <br />
              <Link href={"/dashboard/collection"}>
                <HStack gap={4}>
                  <BsCurrencyRupee size={20} />
                  <Text>Collection</Text>
                </HStack>
              </Link>
              <Link href={"/dashboard/groups"}>
                <HStack gap={4}>
                  <MdGroups size={20} />
                  <Text>Groups</Text>
                </HStack>
              </Link>
              <Link href={"/dashboard/team-funding"}>
                <HStack gap={4}>
                  <GiChestnutLeaf size={20} />
                  <Text>Viro Team Funding</Text>
                </HStack>
              </Link>
              <Link href={"/dashboard/all-team"}>
                <HStack gap={4}>
                  <FaHandshake size={20} />
                  <Text>All Team Processing</Text>
                </HStack>
              </Link>
              <br />
              {myRole == "agent" || myRole == "distributor" ? (
                <Link href={"/dashboard/users"}>
                  <HStack gap={4}>
                    <FaUsers size={20} />
                    <Text>Manage Users</Text>
                  </HStack>
                </Link>
              ) : null}
              <Link href={"/dashboard"}>
                <HStack gap={4}>
                  <BsMegaphoneFill size={20} />
                  <Text>Broadcast</Text>
                </HStack>
              </Link>
              <HStack gap={4} onClick={handleLogout} cursor={"pointer"}>
                <BsPower size={20} />
                <Text>Log Out</Text>
              </HStack>
            </VStack>
          </Box>
        </Show>
        <Box p={[4, 8, 8]} w={"full"} height={"100vh"} overflowY={"scroll"}>
          <HStack gap={8} pb={4} w={"full"} justifyContent={'flex-end'}>
            <HStack rounded={"full"} gap={4} bgColor={"gray.50"}>
              <IconButton
                bgColor={"pink.400"}
                color={"#FFF"}
                icon={<MdSlowMotionVideo />}
                rounded={"full"}
                size={"sm"}
              />
              <Box>
                <Text fontSize={"8"}>Ad Points</Text>
                <Text fontSize={"md"} fontWeight={"semibold"}>
                  0
                </Text>
              </Box>
            </HStack>
            <HStack rounded={"full"} gap={4} bgColor={"gray.50"}>
              <IconButton
                bgColor={"red.400"}
                color={"#FFF"}
                icon={<AiFillHeart />}
                rounded={"full"}
                size={"sm"}
              />
              <Box>
                <Text fontSize={"8"}>Health Points</Text>
                <Text fontSize={"md"} fontWeight={"semibold"}>
                  0
                </Text>
              </Box>
            </HStack>
            <HStack rounded={"full"} gap={4} bgColor={"gray.50"}>
              <IconButton
                bgColor={"yellow.500"}
                color={"#FFF"}
                icon={<GiChestnutLeaf />}
                rounded={"full"}
                size={"sm"}
              />
              <Box>
                <Text fontSize={"8"}>Viro Points</Text>
                <Text fontSize={"md"} fontWeight={"semibold"}>
                  0
                </Text>
              </Box>
            </HStack>
          </HStack>
          {children}
        </Box>
      </Stack>
    </>
  );
};

export default Layout;
