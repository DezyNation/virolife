"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Show,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import BackendAxios from "@/utils/axios";
import parse from "html-react-parser";

const CampaignInfo = ({ params }) => {
  const Toast = useToast({ position: "top-right" });
  const [selectedImg, setSelectedImg] = useState(
    "https://idea.batumi.ge/files/default.jpg"
  );
  const [images, setImages] = useState([]);
  const { id } = params;
  const [campaign, setCampaign] = useState({});
  useEffect(() => {
    BackendAxios.get(`/api/campaign/${id}`)
      .then((res) => {
        setCampaign(res.data[0]);
        console.log(JSON.parse(JSON.parse(res.data[0]?.beneficiary_details)));
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }, []);

  useEffect(() => {
    console.log(campaign);
    if (
      Array.isArray(campaign?.file_path) ||
      typeof campaign?.file_path == "object"
    ) {
      setSelectedImg(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${
          JSON.parse(campaign?.file_path)[0]
        }`
      );
      const campaignImages = JSON.parse(campaign?.file_path)?.map(
        (img) => `${process.env.NEXT_PUBLIC_BACKEND_URL}/${img}`
      );
      setImages(campaignImages);
    }
  }, [campaign]);

  return (
    <>
      <Stack direction={["column", "row"]} justifyContent={"space-between"}>
        {/* Campaign Details */}
        <Box>
          <Text
            fontSize={["2xl", "3xl", "4xl"]}
            fontWeight={"semibold"}
            textTransform={"capitalize"}
          >
            {campaign?.title}
          </Text>
          <Text pb={8}>
            Need ₹{Number(campaign?.target_amount)?.toLocaleString("en-IN")}{" "}
            till &nbsp;
            {new Date(campaign?.updated_at).toDateString()} - Campaign By{" "}
            {campaign?.user?.name}
          </Text>
          <Stack direction={["column", "row"]} gap={8} mb={16}>
            <Image
              src={selectedImg}
              w={["100%", "lg", "3xl"]}
              objectFit={"cover"}
              h={["xs", "lg"]}
              rounded={16}
            />
            <Stack
              direction={["row", "column"]}
              w={["full", "48"]}
              h={["auto", "lg"]}
              gap={6}
              overflowX={["scroll", "visible"]}
              overflowY={["visible", "scroll"]}
              className="hide-scrollbar"
            >
              {images.map((img, key) => (
                <Image
                  key={key}
                  src={img}
                  boxSize={["24"]}
                  objectFit={"cover"}
                  rounded={16}
                  cursor={"pointer"}
                  onClick={() => setSelectedImg(img)}
                  border={"2px"}
                  borderColor={
                    selectedImg == img ? "yellow.400" : "transparent"
                  }
                />
              ))}
            </Stack>
          </Stack>
          <Text fontWeight={"semibold"}>
            Category: {campaign?.category?.name}
          </Text>
          <br />
          <Text
            maxW={["full", "xl", "4xl"]}
            p={4}
            bgColor={"blue.50"}
            rounded={"12"}
          >
            {campaign?.beneficiary_details != null &&
            campaign?.beneficiary_details != "null" ? (
              <>
                This campaign will benefit{" "}
                {typeof campaign?.beneficiary_details == "object" &&
                  JSON.parse(campaign?.beneficiary_details)?.name}
                {typeof campaign?.beneficiary_details == "object" &&
                JSON.parse(campaign?.beneficiary_details)?.address
                  ? ` of ${JSON.parse(campaign?.beneficiary_details)?.address}`
                  : ""}
                <br />
              </>
            ) : null}
            {campaign?.description}
          </Text>
          <br />
          <br />
          <Box pb={16} maxW={["full", "xl", "4xl"]}>
            {parse(campaign?.full_description || "")}
          </Box>
          {/* <Text pb={16} maxW={["full", "xl", "4xl"]}>
            {campaign?.full_description}
          </Text> */}
        </Box>
      </Stack>
    </>
  );
};

export default CampaignInfo;
