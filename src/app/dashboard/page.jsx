"use client";
import React, { useEffect, useState } from "react";
import {
  Text,
  Stack,
  Box,
  Image,
  Button,
  HStack,
  VStack,
  useToast,
} from "@chakra-ui/react";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  BsArrowRight,
  BsCashCoin,
  BsCurrencyRupee,
  BsMegaphoneFill,
  BsYoutube,
} from "react-icons/bs";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { isExpired } from "react-jwt";
import BackendAxios from "@/utils/axios";
import { MdGroups } from "react-icons/md";
import Cookies from "js-cookie";
import useAuth from "@/utils/hooks/useAuth";

const DashboardHome = () => {
  const Toast = useToast();
  const { fetchMyInfo, authUser, myRole } = useAuth();
  const [sessionExpired, setSessionExpired] = useState(false);

  const [collections, setCollections] = useState(null);
  const [team, setTeam] = useState({
    primary: [],
    secondary: [],
  });

  useEffect(() => {
    setSessionExpired(isExpired(Cookies.get("jwt")));
  }, [Cookies.get()]);

  useEffect(() => {
    fetchMyInfo();
  }, []);

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    fetchMyTeam("primary");
    fetchMyTeam("secondary");
  }, []);

  function fetchCollections() {
    BackendAxios.get(`/api/total-donation`)
      .then((res) => {
        setCollections(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Error while fetching total collection",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function fetchMyTeam(groupType) {
    BackendAxios.get(`/api/user/direct-junior/${groupType}`)
      .then((res) => {
        if(groupType == "primary"){
          setTeam((prev) => ({
            ...prev,
            primary: res.data
          }))
        }
        else{
          setTeam((prev) => ({
            ...prev,
            secondary: res.data
          }))
        }
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Error while fetching your team members",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  if (sessionExpired) {
    return (
      <>
        <Text>Session expired! Please login again to view this page</Text>
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
          <StatsCard icon={<MdGroups size={28} />} title={"my team"} />
          <StatsCard
            icon={<BsMegaphoneFill size={28} />}
            title={"active campaigns"}
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

      {/* <Box pt={16}>
        <Stack
          direction={["column", "row"]}
          gap={8}
          justifyContent={"space-between"}
        >
          <Box flex={["unset", 4]}>
            <Text pb={8}>Your Most Recent Campaign</Text>
            {campaigns.length > 0 && (
              <Box
                pos={"relative"}
                boxShadow={"md"}
                rounded={8}
                overflow={"hidden"}
                bgImage={
                  campaigns[0]?.file_path
                    ? `https://virolife.in/${campaigns[0]?.file_path}`
                    : "https://idea.batumi.ge/files/default.jpg"
                }
                bgSize={"cover"}
                bgRepeat={"no-repeat"}
                h={"sm"}
                cursor={"pointer"}
              >
                <Box
                  position={"absolute"}
                  w={"full"}
                  h={"sm"}
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  p={4}
                  bgImage={
                    "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.3))"
                  }
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"flex-start"}
                  justifyContent={"flex-end"}
                >
                  <Text pos={"absolute"} top={4} right={4} color={"#FFF"}>
                    {new Date(campaigns[0]?.updated_at).toDateString()}
                  </Text>
                  <Text className="serif" fontSize={"3xl"} color={"#FFF"}>
                    {campaigns[0]?.title}
                  </Text>
                  <Text fontSize={"xs"} color={"#FFF"}>
                    {campaigns[0]?.description}
                  </Text>
                </Box>
              </Box>
            )}

            <Link href={"/dashboard/campaigns"}>
              <Button mt={8} colorScheme="yellow" rightIcon={<BsArrowRight />}>
                View All Campaigns
              </Button>
            </Link>
          </Box>
          <Box flex={["unset", 2]}>
            <Text pb={8}>Your Top Contributors</Text>
            
                        <VStack gap={4} w={'full'} p={4} boxShadow={'md'} rounded={8}>
                            <Box w={'full'} p={2} borderBottom={'1px'} borderColor={'#DDD'}>
                                <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                                    <Box>
                                        <Text className='serif'>Sangam Kumar</Text>
                                        <Text fontSize={'xs'} color={'#AAA'}>for Save The Cows</Text>
                                    </Box>
                                    <Text fontSize={'sm'} fontWeight={'semibold'}>₹4571</Text>
                                </HStack>
                            </Box>
                            <Box w={'full'} p={2} borderBottom={'1px'} borderColor={'#DDD'}>
                                <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                                    <Box>
                                        <Text className='serif'>John Doe</Text>
                                        <Text fontSize={'xs'} color={'#AAA'}>for Save The Cows</Text>
                                    </Box>
                                    <Text fontSize={'sm'} fontWeight={'semibold'}>₹3654</Text>
                                </HStack>
                            </Box>
                            <Box w={'full'} p={2} borderBottom={'1px'} borderColor={'#DDD'}>
                                <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                                    <Box>
                                        <Text className='serif'>Sanjay Mehta</Text>
                                        <Text fontSize={'xs'} color={'#AAA'}>for Save The Cows</Text>
                                    </Box>
                                    <Text fontSize={'sm'} fontWeight={'semibold'}>₹3600</Text>
                                </HStack>
                            </Box>
                            <Box w={'full'} p={2} borderBottom={'1px'} borderColor={'#DDD'}>
                                <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                                    <Box>
                                        <Text className='serif'>George Bush</Text>
                                        <Text fontSize={'xs'} color={'#AAA'}>for Save The Cows</Text>
                                    </Box>
                                    <Text fontSize={'sm'} fontWeight={'semibold'}>₹2154</Text>
                                </HStack>
                            </Box>
                            <Box w={'full'} p={2} borderBottom={'1px'} borderColor={'#DDD'}>
                                <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                                    <Box>
                                        <Text className='serif'>Tilak Prasad</Text>
                                        <Text fontSize={'xs'} color={'#AAA'}>for Save The Cows</Text>
                                    </Box>
                                    <Text fontSize={'sm'} fontWeight={'semibold'}>₹3884</Text>
                                </HStack>
                            </Box>
                            <Button pt={4} w={'full'} variant={'link'} colorScheme='yellow'>
                                View All Contributors
                            </Button>
                        </VStack>
                       
          </Box>
        </Stack>
      </Box> */}
    </>
  );
};

export default DashboardHome;
