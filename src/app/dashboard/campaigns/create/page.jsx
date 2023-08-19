"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Text,
  Box,
  Image,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Textarea,
  HStack,
  Icon,
  useToast,
  Select,
  Stack,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { BsXCircleFill } from "react-icons/bs";
import BackendAxios, { FormAxios } from "@/utils/axios";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Page = () => {
  const Toast = useToast({ position: "top-right" });
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState({
    type: "myself",
    name: "",
    address: "",
    contact: "",
  });

  const onDrop = useCallback(async (acceptedFiles) => {
    console.log(acceptedFiles);
    Formik.setFieldValue("files", acceptedFiles);
    const newImages = acceptedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages)
      .then((imagePreviews) =>
        setSelectedImages((prevImages) => [...prevImages, ...imagePreviews])
      )
      .catch((error) => console.error("Error reading file:", error));
  }, []);

  const removeImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    Formik.setFieldValue(
      "files",
      Formik.values.files?.filter((_, i) => i !== index)
    );
  };

  const [selectedImages, setSelectedImages] = useState([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  const Formik = useFormik({
    initialValues: {
      title: "",
      files: null,
      description: "",
      full_description: "",
      category_id: "",
      target_amount: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      FormAxios.post("/api/campaign", {
        ...values,
        beneficiaryDetails: JSON.stringify(beneficiaryDetails),
        from: new Date(selectedDates[0]).getUTCSeconds(),
        to: new Date(selectedDates[1]).getUTCSeconds(),
      })
        .then((res) => {
          setLoading(false);
          Toast({
            status: "success",
            description: "Your campaign was sent for review!",
          });
        })
        .catch((err) => {
          setLoading(false);
          Toast({
            status: "error",
            description:
              err?.response?.data?.message ||
              err?.response?.data ||
              err?.message,
          });
        });
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Text pb={4} fontSize={"2xl"} className="serif">
        Create New Campaign
      </Text>
      <br />
      <Stack
        direction={["column", "row"]}
        justifyContent={"space-between"}
        gap={8}
        py={6}
      >
        <FormControl py={4} w={["full", "xs"]}>
          <FormLabel>Select Category</FormLabel>
          <Select
            name="category_id"
            placeholder="Select Here"
            onChange={Formik.handleChange}
          >
            <option value="1">Medical</option>
            <option value="2">Education</option>
            <option value="3">New Startup</option>
            <option value="4">Sports Help</option>
          </Select>
        </FormControl>
        <FormControl py={4} w={["full", "xs"]}>
          <FormLabel>How much amount you need?</FormLabel>
          <InputGroup>
            <InputLeftElement children={"₹"} />
            <Input
              type="number"
              name={"target_amount"}
              onChange={Formik.handleChange}
            />
          </InputGroup>
        </FormControl>
        <FormControl py={4} w={["full", "xs"]}>
          <FormLabel>Duration</FormLabel>
          <RangeDatepicker
            selectedDates={selectedDates}
            onDateChange={setSelectedDates}
          />
        </FormControl>
      </Stack>
      <FormControl py={4}>
        <FormLabel>Enter title for your campaign</FormLabel>
        <Input
          w={"full"}
          variant={"flushed"}
          fontSize={["xl", "2xl", "3xl"]}
          className="serif"
          p={2}
          name="title"
          placeholder="e.g: Help us build a school for underpreviliged children"
          onChange={Formik.handleChange}
        />
      </FormControl>
      <Box p={4}>
        <Text pb={4} fontWeight={"semibold"}>
          Upload Image
        </Text>
        <VStack
          {...getRootProps()}
          w={["full", "lg"]}
          h={"xs"}
          rounded={16}
          border={"1px"}
          borderStyle={"dashed"}
          bg={"#FAFAFA"}
          cursor={"pointer"}
          justifyContent={"center"}
        >
          <Input visibility={"hidden"} {...getInputProps()} />
          {isDragActive ? (
            <Text>Drop Your Files Here...</Text>
          ) : (
            <Text>Click to Upload Or Drop Your Files Here...</Text>
          )}
        </VStack>
        <HStack py={4}>
          {selectedImages.map((image, index) => (
            <Box key={index} pos={"relative"}>
              <Icon
                as={BsXCircleFill}
                color={"red"}
                pos={"absolute"}
                size={12}
                top={0}
                right={0}
                onClick={() => removeImage(index)}
              />
              <Image
                src={image}
                w={36}
                h={36}
                rounded={16}
                objectFit={"cover"}
              />
            </Box>
          ))}
        </HStack>
      </Box>
      <FormControl py={4}>
        <FormLabel>Short Description (15-20 words)</FormLabel>
        <Textarea
          w={"full"}
          name="description"
          onChange={Formik.handleChange}
          placeholder="Brief description of your campaign"
        ></Textarea>
      </FormControl>
      <FormControl py={4}>
        <FormLabel>Your message</FormLabel>
        {/* <Textarea
          w={"full"}
          name="full_description"
          onChange={Formik.handleChange}
          placeholder="Tell us about your campaign"
        ></Textarea> */}
        {isClient ? (
          <ReactQuill
            theme="snow"
            value={Formik.values.full_description}
            onChange={(value) =>
              Formik.setFieldValue("full_description", value)
            }
            style={{ height: "400px" }}
          />
        ) : null}
      </FormControl>
      <br />
      <br />
      <br />
      <VStack
        w={"full"}
        py={4}
        alignItems={"flex-start"}
        justifyContent={"flex-start"}
      >
        <Text fontSize={"lg"} className="serif">
          Who will benefit from this campaign?
        </Text>
        <FormControl>
          <Stack direction={["column", "row"]} gap={"4"}>
            <Button
              colorScheme="yellow"
              variant={
                beneficiaryDetails.type == "myself" ? "solid" : "outline"
              }
              onClick={() =>
                setBeneficiaryDetails({
                  ...beneficiaryDetails,
                  type: "myself",
                  name: localStorage.getItem("userName"),
                })
              }
            >
              Myself
            </Button>
            <Button
              colorScheme="yellow"
              variant={
                beneficiaryDetails.type == "myfamily" ? "solid" : "outline"
              }
              onClick={() =>
                setBeneficiaryDetails({
                  ...beneficiaryDetails,
                  type: "myfamily",
                })
              }
            >
              My Family
            </Button>
            <Button
              colorScheme="yellow"
              variant={
                beneficiaryDetails.type == "individual" ? "solid" : "outline"
              }
              onClick={() =>
                setBeneficiaryDetails({
                  ...beneficiaryDetails,
                  type: "individual",
                })
              }
            >
              Other Individual
            </Button>
            <Button
              colorScheme="yellow"
              variant={beneficiaryDetails.type == "group" ? "solid" : "outline"}
              onClick={() =>
                setBeneficiaryDetails({ ...beneficiaryDetails, type: "group" })
              }
            >
              Group or Community
            </Button>
          </Stack>
        </FormControl>
        <br />
        {beneficiaryDetails.type == "myself" || (
          <VStack
            w={"full"}
            py={4}
            gap={8}
            alignItems={"flex-start"}
            justifyContent={"flex-start"}
          >
            <FormControl w={["full", "xs"]}>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter beneficiary name"
                onChange={(e) =>
                  setBeneficiaryDetails({
                    ...beneficiaryDetails,
                    name: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl w={["full", "xs"]}>
              <FormLabel>Contact</FormLabel>
              <Input
                placeholder="Beneficiary contact details"
                onChange={(e) =>
                  setBeneficiaryDetails({
                    ...beneficiaryDetails,
                    contact: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl w={["full", "xs"]}>
              <FormLabel>Address</FormLabel>
              <Input
                placeholder="Beneficiary address"
                onChange={(e) =>
                  setBeneficiaryDetails({
                    ...beneficiaryDetails,
                    address: e.target.value,
                  })
                }
              />
            </FormControl>
          </VStack>
        )}
      </VStack>
      <HStack justifyContent={"flex-end"} py={4}>
        <Button
          colorScheme="yellow"
          isLoading={loading}
          onClick={Formik.handleSubmit}
        >
          Send For Review
        </Button>
      </HStack>
    </>
  );
};

export default Page;
