"use client";
import { Avatar, Box, Button, HStack, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from "@chakra-ui/react";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import VideoPlayer from "../global/VideoPlayer";
import QRCode from "react-qr-code";
import BackendAxios from "@/utils/axios";

const ChildMemberCard = ({
  name,
  id,
  phone_number,
  donation_received,
  groupType,
  upi_id
}) => {
  const Toast = useToast();
  const [amount, setAmount] = useState(0);
  const [showDonateBtn, setShowDonateBtn] = useState(false);

  const [qrModal, setQrModal] = useState(false);
  const [videoStatus, setVideoStatus] = useState(false)
  const [videoData, setVideoData] = useState({
    title: "Watch this video to proceed.",
    id: "",
    provider: "",
    onVideoClose: () => {
      return null;
    },
  });

  const [upi, setUpi] = useState("");
  const [receiver, setReceiver] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    let amt = 0;
    if (groupType == "primary") {
      amt = localStorage.getItem(`primaryJuniorAmount`);
      setAmount(amt);
      return;
    }
    if (groupType == "secondary") {
      amt = localStorage.getItem(`secondaryJuniorAmount`);
      setAmount(amt);
      return;
    }
  }, []);

  useEffect(() => {
    const onHold = parseInt(localStorage.getItem("onHold")) === 1;
    if (parseInt(amount) > 0 && !onHold) {
      setShowDonateBtn(true);
    } else {
      setShowDonateBtn(false);
    }
  }, [amount]);

  function showVideo(user) {
    setVideoStatus(true);
    setVideoData({
      ...videoData,
      onVideoClose: () => {
        setVideoStatus(false);
        showUpiModal(user);
      },
    });
  }

  function showUpiModal(user) {
    if (groupType == "primary" && !user?.primary_activated) {
      setUpi("9022853554@okbizaxis");
      setReceiver({
        id: user?.id,
        name: "Virolife Foundation",
      });
      setQrModal(true);
      return;
    }
    if (groupType == "secondary" && !user?.secondary_activated) {
      setUpi("9022853554@okbizaxis");
      setReceiver({
        id: user?.id,
        name: "Virolife Foundation",
      });
      setQrModal(true);
      return;
    }
    if (!user?.upi_id) {
      setUpi("9022853554@okbizaxis");
      setReceiver({
        id: user?.id,
        name: "Virolife Foundation",
      });
      setQrModal(true);
      return;
    }
    setUpi(user?.upi_id);
    setReceiver({
      id: user?.id,
      name: user?.parent_name,
    });
    setQrModal(true);
  }

  function donate() {
    BackendAxios.post(
      receiver?.name == "Virolife Foundation"
        ? `/api/donate/admin`
        : `/api/donation`,
      {
        donatable_id: receiver?.id,
        amount: amount,
        remarks: `Donation to ${groupType} group junior  VCF${receiver.id}`,
        group: groupType,
      }
    )
      .then((res) => {
        Toast({
          status: "success",
          description: "Notification sent to junior",
        });
        setQrModal(false);
        setTimeout(() => {
          window.location.reload(true);
        }, 300);
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          Cookies.remove("jwt");
          localStorage.clear();
          window.location.assign("/");
          return;
        }
        setQrModal(false);
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  return (
    <>
      <HStack py={4} w={["full", "xs"]} justifyContent={"space-between"}>
        <HStack alignItems={"flex-start"}>
          <Avatar name={name} />
          <Box w={"full"}>
            <Text className="serif" fontWeight={"semibold"} fontSize={"lg"}>
              {name}
            </Text>
            <Text fontSize={"xs"}>
              ID: {process.env.NEXT_PUBLIC_CODE}
              {id} &nbsp; | &nbsp; Phone: {phone_number?.slice(0, 9)}
            </Text>
          </Box>
          {showDonateBtn ? (
            <Button
              size={"xs"}
              variant={donation_received ? "ghost" : "solid"}
              colorScheme="yellow"
              onClick={()=>{
                if(!donation_received){
                  showVideo({name: name, id: id, upi_id: upi_id})
                }
              }}
            >
              {donation_received ? "Donated" : "Donate"}
            </Button>
          ) : null}
        </HStack>
      </HStack>

      <Modal size={"xs"} isOpen={qrModal} onClose={() => setQrModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Donate ₹{amount} to {receiver.name}
          </ModalHeader>
          <ModalBody alignItems={"center"} justifyContent={"center"}>
            <QRCode
              size={256}
              value={`upi://pay?cu=INR&pa=${upi}&am=${amount}`}
            />
            <br />
            <Text textAlign={"center"}>Pay with any UPI app</Text>
            <Image
              w={"80%"}
              src={"https://mytechtrips.com/wp-content/uploads/2023/01/upi.png"}
              objectFit={"contain"}
              mx={"auto"}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="yellow"
              rounded={"full"}
              onClick={() => donate(receiver.id)}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {videoStatus ? (
        <VideoPlayer
          status={videoStatus}
          title={videoData.title}
          onVideoClose={videoData.onVideoClose}
        />
      ) : null}
    </>
  );
};

export default ChildMemberCard;
