"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Toast,
} from "@chakra-ui/react";
import BackendAxios from "@/utils/axios";
import Cookies from "js-cookie";
import VideoPlayer from "@/components/global/VideoPlayer";
import QRCode from "react-qr-code";

const DonateButton = ({ amount, userId, userName, upiId, groupType, donatedTo, instanceId }) => {
  const [showDonateBtn, setShowDonateBtn] = useState(true);
  const [qrModal, setQrModal] = useState(false);
  const [videoStatus, setVideoStatus] = useState(false);
  const [videoData, setVideoData] = useState({
    title: "Watch this video to proceed.",
    id: "",
    provider: "",
    onVideoClose: () => {
      return null;
    },
  });

  useEffect(() => {
    const onHold = parseInt(localStorage.getItem("onHold")) === 1;
    if (parseInt(amount) > 0 && !onHold) {
      setShowDonateBtn(true);
    } else {
      setShowDonateBtn(false);
    }
  }, []);

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
    setQrModal(true);
  }

  function donate() {
    BackendAxios.post(donatedTo == "senior" ? `/api/donation` : donatedTo == "inactive-junior" ? `/api/donate-inactive-junior/${instanceId}` : `/api/donate-junior/${instanceId}`,
      {
        donatable_id: userId,
        amount: amount,
        remarks: `Donation in ${groupType} group VCF${userId}`,
        group: groupType,
        donated: 1
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
      {showDonateBtn ? (
        <Button
          size={"sm"}
          rounded={"full"}
          colorScheme="yellow"
          onClick={() =>
            showVideo({ name: userName, id: userId, upi_id: upiId })
          }
        >
          Donate
        </Button>
      ) : null}

      <Modal size={"xs"} isOpen={qrModal} onClose={() => setQrModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Donate ₹{amount} to {userName}
          </ModalHeader>
          <ModalBody alignItems={"center"} justifyContent={"center"}>
            <QRCode
              size={256}
              value={`upi://pay?cu=INR&pa=${upiId}&am=${amount}`}
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
              onClick={() => donate(userId)}
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

export default DonateButton;
