"use client";
import useAuth from "@/utils/hooks/useAuth";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { GiChestnutLeaf } from "react-icons/gi";
import { MdSlowMotionVideo } from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";
import { useFormik } from "formik";
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";

const Points = () => {
  const [points, setPoints] = useState({});
  const [loading, setLoading] = useState(false);
  const [intent, setIntent] = useState("");
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [campaigns, setCampaigns] = useState([]);

  const Toast = useToast({
    position: "top-right",
  });
  const { fetchMyInfo } = useAuth();
  const { handleError } = useApiHandler();
  const { onToggle, isOpen } = useDisclosure();

  const Formik = useFormik({
    initialValues: {
      campaignId: "",
      points: ""
    },
    onSubmit: (values) => {
      if (values?.points > points?.healthPoints || values?.points <= 0) {
        Toast({
          description: "Please enter valid points",
        });
        return;
      }
      if (intent == "transfer") {
        requestTransfer();
      }
      if (intent == "withdrawal") {
        requestWithdrawal()
      }
    },
  });

  useEffect(() => {
    refreshPoints();
  }, []);

  useEffect(() => {
    if (intent == "withdrawal") {
      fetchCampaigns();
    }
  }, [intent]);

  function requestTransfer() {
    BackendAxios.post("/api/user/points/request-transfer", {
      points: Formik.values.points,
      beneficiaryId: beneficiaryId,
    })
      .then(async (res) => {
        await refreshPoints();
        Toast({
          status: "success",
          description:"Request sent to admin successfully"
        })
      })
      .catch((err) => {
        handleError(err, "Failed to request point transfer.");
      });
  }

  function requestWithdrawal() {
    BackendAxios.post("/api/user/points/request-withdrawal", {
      points: Formik.values.points,
      campaignId: Formik.values.campaignId,
    })
      .then(async (res) => {
        await refreshPoints();
      })
      .catch((err) => {
        handleError(err, "Failed to request point transfer.");
      });
  }

  function fetchCampaigns() {
    BackendAxios.get(`/api/user-campaigns`)
      .then((res) => {
        setCampaigns(res.data);
      })
      .catch((err) => {
        handleError(err, "Err while fetching your campaigns");
      });
  }

  async function refreshPoints() {
    setLoading(true);
    await fetchMyInfo();

    BackendAxios.get(`/api/user/points/my-atp`).then(res =>{
      setPoints({
        ...points,
        viroPoints: res.data,
      });
      setLoading(false);
    }).catch(err => {
      setLoading(false);
      handleError(err, "Err while fetching ATP")
    })

    BackendAxios.get(`/api/my-health-points`).then(res =>{
      setPoints({
        ...points,
        adPoints: Cookies.get("adPoints"),
        healthPoints: res.data,
        viroPoints: Cookies.get("viroPoints"),
      });
      setLoading(false);
    }).catch(err => {
      setLoading(false);
      handleError(err, "Err while fetching health points")
    })

  }


  return (
    <>
      <HStack gap={8} pb={4} w={"full"} justifyContent={"flex-end"}>
        <IconButton
          isLoading={loading}
          icon={<FiRefreshCw size={20} />}
          rounded={"full"}
          onClick={refreshPoints}
        />
        <HStack rounded={"full"} gap={0} bgColor={"gray.50"}>
          <IconButton
            bgColor={"pink.400"}
            color={"#FFF"}
            icon={<MdSlowMotionVideo size={20} />}
            rounded={"full"}
          />
          <Box p={2}>
            <Text fontSize={"8"}>Ad Points</Text>
            <Text fontSize={"md"} fontWeight={"semibold"}>
              {points.adPoints}
            </Text>
          </Box>
        </HStack>
        <HStack rounded={"full"} gap={0} bgColor={"gray.50"} onClick={onToggle}>
          <IconButton
            bgColor={"red.400"}
            color={"#FFF"}
            icon={<AiFillHeart size={20} />}
            rounded={"full"}
          />
          <Box p={2}>
            <Text fontSize={"8"}>Health Points</Text>
            <Text fontSize={"md"} fontWeight={"semibold"}>
              {points.healthPoints}
            </Text>
          </Box>
        </HStack>
        <HStack rounded={"full"} gap={0} bgColor={"gray.50"}>
          <IconButton
            bgColor={"yellow.500"}
            color={"#FFF"}
            icon={<GiChestnutLeaf size={20} />}
            rounded={"full"}
          />
          <Box p={2}>
            <Text fontSize={"8"}>ATP</Text>
            <Text fontSize={"md"} fontWeight={"semibold"}>
              {points.viroPoints}
            </Text>
          </Box>
        </HStack>
      </HStack>

      <Modal isOpen={isOpen} onClose={onToggle}>
        <ModalOverlay />
        <ModalContent transition={"all .3s ease"}>
          <ModalHeader>Use your health points</ModalHeader>
          <ModalBody alignItems={"center"} justifyContent={"center"} py={8}>
            <VStack w={"full"}>
              <Text>How would you like to use your health points?</Text>
              <br />
              <Button
                colorScheme={intent == "transfer" ? "yellow" : "gray"}
                onClick={() => setIntent("transfer")}
              >
                Transfer To Someone
              </Button>
              <Button
                colorScheme={intent == "withdrawal" ? "yellow" : "gray"}
                onClick={() => setIntent("withdrawal")}
              >
                Request Money for Medical Treatment
              </Button>
            </VStack>
            {intent == "transfer" ? (
              <Box pt={8}>
                <FormControl>
                  <FormLabel>Enter User ID</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children={"VCF"} />
                    <Input
                      name="beneficiaryId"
                      value={beneficiaryId}
                      onChange={(e) => setBeneficiaryId(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl pt={8}>
                  <FormLabel>How much points you want to transfer?</FormLabel>
                  <Input
                    name="points"
                    value={Formik.values.points}
                    onChange={Formik.handleChange}
                  />
                </FormControl>
                <Text fontSize={"xs"} fontWeight={"semibold"}>
                  These transferred points will expire in 30 days
                </Text>
              </Box>
            ) : intent == "withdrawal" ? (
              <Box pt={8}>
                <FormControl py={4}>
                  <FormLabel>Select Campaign</FormLabel>
                  <Select
                    placeholder="Select campaign"
                    name="campaignId"
                    onChange={Formik.handleChange}
                  >
                    {campaigns?.map((campaign, key) => (
                      <option value={campaign?.id} key={key}>
                        {campaign?.title}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl py={4}>
                  <FormLabel>How much points you want to exchange?</FormLabel>
                  <Input
                    name="points"
                    onChange={Formik.handleChange}
                    value={Formik.values.points}
                    type="number"
                  />
                </FormControl>
              </Box>
            ) : null}
          </ModalBody>
          <ModalBody>
            <HStack justifyContent={"flex-end"} gap={6} py={4}>
              <Button onClick={onToggle}>Cancel</Button>
              <Button onClick={Formik.handleSubmit} colorScheme="twitter">
                Confirm
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      
    </>
  );
};

export default Points;
