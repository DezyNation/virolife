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

const CampaignInfo = ({ params }) => {
  const Toast = useToast({ position: "top-right" });
  const [selectedImg, setSelectedImg] = useState(
    "https://t3.ftcdn.net/jpg/04/19/34/24/360_F_419342418_pBHSf17ZBQn77E7z3OWcXrWfCuxZkc3Q.jpg"
  );
  const { id } = params;
  const [campaign, setCampaign] = useState({});
  useEffect(() => {
    BackendAxios.get(`/api/campaign/${id}`)
      .then((res) => {
        setCampaign(res.data[0]);
        console.log(JSON.parse(JSON.parse(res.data[0]?.beneficiary_details)))
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
              src={
                campaign.file_path
                  ? `https://edulec.in/storage/${campaign.file_path}`
                  : "https://idea.batumi.ge/files/default.jpg"
              }
              w={["100%", "lg", "3xl"]}
              objectFit={"cover"}
              h={["xs", "lg"]}
              rounded={16}
            />
            {/* <Stack
                            direction={['row', 'column']}
                            w={['full', '48']}
                            h={['auto', 'lg']} gap={6}
                            overflowX={['scroll', 'visible']}
                            overflowY={['visible', 'scroll']}
                            className='hide-scrollbar'
                        >
                            <Image
                                src={"https://t3.ftcdn.net/jpg/04/19/34/24/360_F_419342418_pBHSf17ZBQn77E7z3OWcXrWfCuxZkc3Q.jpg"}
                                boxSize={['24']} objectFit={'cover'}
                                rounded={16} cursor={'pointer'}
                                onClick={() => setSelectedImg("https://t3.ftcdn.net/jpg/04/19/34/24/360_F_419342418_pBHSf17ZBQn77E7z3OWcXrWfCuxZkc3Q.jpg")}
                                border={'2px'} borderColor={selectedImg == "https://t3.ftcdn.net/jpg/04/19/34/24/360_F_419342418_pBHSf17ZBQn77E7z3OWcXrWfCuxZkc3Q.jpg" ? "yellow.400" : 'transparent'}
                            />
                            <Image
                                src={"https://imgnew.outlookindia.com/uploadimage/library/16_9/16_9_5/IMAGE_1675431757.jpg"}
                                boxSize={['24']} objectFit={'cover'}
                                rounded={16} cursor={'pointer'}
                                onClick={() => setSelectedImg("https://imgnew.outlookindia.com/uploadimage/library/16_9/16_9_5/IMAGE_1675431757.jpg")}
                                border={'2px'} borderColor={selectedImg == "https://imgnew.outlookindia.com/uploadimage/library/16_9/16_9_5/IMAGE_1675431757.jpg" ? "yellow.400" : 'transparent'}
                            />
                            <Image
                                src={"https://wellnessworks.in/wp-content/uploads/2019/10/indian-cow.jpg"}
                                boxSize={['24']} objectFit={'cover'}
                                rounded={16} cursor={'pointer'}
                                onClick={() => setSelectedImg("https://wellnessworks.in/wp-content/uploads/2019/10/indian-cow.jpg")}
                                border={'2px'} borderColor={selectedImg == "https://wellnessworks.in/wp-content/uploads/2019/10/indian-cow.jpg" ? "yellow.400" : 'transparent'}
                            />
                        </Stack> */}
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
            {campaign.beneficiary_details ? (
              <>
                This campaign will benefit{" "}
                {JSON.parse(JSON.parse(campaign?.beneficiary_details))?.name} of{" "}
                {JSON.parse(JSON.parse(campaign?.beneficiary_details))?.address}
                <br />
              </>
            ) : null}
            {campaign.description}
          </Text>
          <br />
          <br />
          <Text pb={16} maxW={["full", "xl", "4xl"]}>
            {campaign.full_description}
          </Text>
        </Box>
      </Stack>
    </>
  );
};

export default CampaignInfo;
