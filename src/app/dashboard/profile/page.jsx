"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { BsArrowRight } from "react-icons/bs";
import { useFormik } from "formik";
import { isExpired } from "react-jwt";
import BackendAxios, { FormAxios } from "@/utils/axios";
import Cookies from "js-cookie";

const Info = () => {
  const Toast = useToast({ position: "top-right" });
  const [gender, setGender] = useState("");
  const [authUser, setAuthUser] = useState({});
  const [addressObj, setAddressObj] = useState({
    line: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [disabledInputs, setDisabledInputs] = useState({
    line: true,
    landmark: true,
    city: true,
    state: true,
    pincode: true,
    firstName: false,
    middleName: false,
    lastName: false,
    gender: false,
    pan: false,
    dob: false,
    phone: false,
    email: false,
    attachment1: false,
    attachment2: false,
    accountNumber: false,
    bankName: false,
    micr: false,
    ifsc: false,
    upi: false,
  });

  const Formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      pan: "",
      gender: gender,
      dob: "",
      phone: "",
      email: "",
      attachment1: null,
      attachment2: null,
      accountNumber: "",
      bankName: "",
      micr: "",
      ifsc: "",
      upi: "",
      address: "",
    },
    onSubmit: (values) => {
      FormAxios.post(`/update-user`, {
        ...values,
        address: JSON.stringify(addressObj),
        gender: gender,
        name:
          values.firstName +
          (values.middleName && values.lastName
            ? ` ${values.middleName} ${values.lastName}`
            : !values.middleName && values.lastName && ` ${values.lastName}`),
      })
        .then((res) => {
          Toast({
            status: "success",
            description: "Data updated successfully!",
          });
        })
        .catch((err) => {
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
    if (!isExpired(Cookies.get("jwt"))) {
      fetchInfo();
    }
    if (isExpired(Cookies.get("jwt"))) {
      window.location.replace("/");
    }
  }, []);

  function fetchInfo() {
    BackendAxios.get("/auth-user")
      .then((res) => {
        setAuthUser(res.data[0]);
        const emptyAddress = JSON.stringify({
          line: "",
          landmark: "",
          city: "",
          state: "",
        });
        const address = JSON.parse(res.data[0]?.address || emptyAddress);
        Formik.setFieldValue("firstName", res.data[0]?.name?.split(" ")[0]);
        if (res.data[0]?.name?.split(" ")?.length >= 3)
          Formik.setFieldValue("middleName", res.data[0]?.name?.split(" ")[1]);
        if (res.data[0]?.name?.split(" ")?.length >= 3)
          Formik.setFieldValue("lastName", res.data[0]?.name?.split(" ")[2]);
        if (res.data[0]?.name?.split(" ")?.length >= 2)
          Formik.setFieldValue("lastName", res.data[0]?.name?.split(" ")[1]);
        Formik.setFieldValue("dob", res.data[0]?.dob);
        Formik.setFieldValue("gender", res.data[0]?.gender);
        setGender(res.data[0]?.gender)
        Formik.setFieldValue("pan", res.data[0]?.pan);
        Formik.setFieldValue("phone", res.data[0]?.phone_number);
        Formik.setFieldValue("email", res.data[0]?.email);
        Formik.setFieldValue("upi", res.data[0]?.upi_id);
        Formik.setFieldValue("ifsc", res.data[0]?.ifsc);
        Formik.setFieldValue("bankName", res.data[0]?.bank_name);
        Formik.setFieldValue("accountNumber", res.data[0]?.account_number);
        Formik.setFieldValue("micr", res.data[0]?.micr);
        setAddressObj({
          line: address?.line,
          city: address?.city,
          state: address?.state,
          pincode: address?.pincode,
          landmark: address?.landmark,
        });
        setDisabledInputs({
          ...disabledInputs,
          firstName: Boolean(res.data[0]?.name),
          middleName: Boolean(res.data[0]?.name),
          lastName: Boolean(res.data[0]?.name),
          dob: Boolean(res.data[0]?.dob),
          gender: Boolean(res.data[0]?.gender),
          pan: Boolean(res.data[0]?.pan),
          phone: Boolean(res.data[0]?.phone_number),
          email: Boolean(res.data[0]?.email),
          upi: Boolean(res.data[0]?.upi_id),
          ifsc: Boolean(res.data[0]?.ifsc),
          bankName: Boolean(res.data[0]?.bank_name),
          accountNumber: Boolean(res.data[0]?.account_number),
          micr: Boolean(res.data[0]?.micr),
          line: Boolean(address?.line),
          landmark: Boolean(address?.landmark),
          city: Boolean(address?.city),
          state: Boolean(address?.state),
          pincode: Boolean(address?.pincode),
          attachment1: Boolean(res.data[0]?.attachment1),
          attachment2: Boolean(res.data[0]?.attachment2),
        });
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  return (
    <>
      <form action="#" onSubmit={Formik.handleSubmit}>
        <Box p={4} w={"full"}>
          <Stack
            w={"full"}
            pb={16}
            gap={8}
            direction={["column", "row"]}
            justifyContent={"flex-start"}
          >
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  FIRST NAME
                </FormLabel>
                <Input
                  isDisabled={disabledInputs.firstName}
                  name="firstName"
                  value={Formik.values.firstName}
                  onChange={Formik.handleChange}
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  MIDDLE NAME
                </FormLabel>
                <Input
                  isDisabled={disabledInputs.middleName}
                  name="middleName"
                  value={Formik.values.middleName}
                  onChange={Formik.handleChange}
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  LAST NAME
                </FormLabel>
                <Input
                  isDisabled={disabledInputs.lastName}
                  name="lastName"
                  value={Formik.values.lastName}
                  onChange={Formik.handleChange}
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
          </Stack>

          <Stack
            pb={16}
            gap={8}
            direction={["column", "row"]}
            justifyContent={"flex-start"}
          >
            <Box w={["full", "xs"]}>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                GENDER
              </FormLabel>
              <HStack gap={4} w={["full", "xs"]}>
                <Button
                  isDisabled={disabledInputs.gender}
                  rounded={"full"}
                  colorScheme="yellow"
                  onClick={() => setGender("male")}
                  variant={gender == "male" ? "solid" : "outline"}
                >
                  M
                </Button>
                <Button
                  isDisabled={disabledInputs.gender}
                  rounded={"full"}
                  colorScheme="yellow"
                  onClick={() => setGender("female")}
                  variant={gender == "female" ? "solid" : "outline"}
                >
                  F
                </Button>
                <Button
                  isDisabled={disabledInputs.gender}
                  rounded={"full"}
                  colorScheme="yellow"
                  onClick={() => setGender("others")}
                  variant={gender == "others" ? "solid" : "outline"}
                >
                  O
                </Button>
              </HStack>
            </Box>

            <Box gap={4} w={["full", "xs"]}>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                date of birth
              </FormLabel>
              <Input
                isDisabled={disabledInputs.dob}
                bg={"blanchedalmond"}
                w={["full", "xs"]}
                type="date"
                name="dob"
                value={Formik.values.dob}
                onChange={Formik.handleChange}
              />
            </Box>

            <Box gap={4} w={["full", "xs"]}>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                PAN
              </FormLabel>
              <Input
                isDisabled={disabledInputs.pan}
                bg={"blanchedalmond"}
                w={["full", "xs"]}
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                name="pan"
                textTransform={'uppercase'}
                value={Formik.values.pan}
                onChange={Formik.handleChange}
              />
            </Box>

          </Stack>

          <Stack
            w={"full"}
            gap={8}
            pb={16}
            direction={["column", "row"]}
            justifyContent={"space-between"}
          >
            <FormControl>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                CONTACT NO
              </FormLabel>
              <HStack>
                <Input
                  isDisabled={disabledInputs.phone}
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                  name="phone"
                  value={Formik.values.phone}
                  onChange={Formik.handleChange}
                />
                <Text cursor={"pointer"}>Verify</Text>
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                EMAIL ID
              </FormLabel>
              <HStack>
                <Input
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                  name="email"
                  value={Formik.values.email}
                  disabled
                />
              </HStack>
            </FormControl>
          </Stack>

          <Text fontSize={"lg"} pb={8}>
            BANKING DETAILS
          </Text>
          <Stack
            pb={16}
            gap={8}
            direction={["column", "row"]}
            justifyContent={"space-between"}
          >
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  ACCOUNT NUMBER
                </FormLabel>
                <Input
                  isDisabled={disabledInputs.accountNumber}
                  name="accountNumber"
                  value={Formik.values.accountNumber}
                  onChange={Formik.handleChange}
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  BANK NAME
                </FormLabel>
                <Input
                  isDisabled={disabledInputs.bankName}
                  name="bankName"
                  value={Formik.values.bankName}
                  onChange={Formik.handleChange}
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  IFSC
                </FormLabel>
                <Input
                  isDisabled={disabledInputs.ifsc}
                  name="ifsc"
                  value={Formik.values.ifsc}
                  onChange={Formik.handleChange}
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
          </Stack>
          <Stack
            pb={16}
            gap={8}
            direction={["column", "row"]}
            justifyContent={"space-between"}
          >
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  UPI ID
                </FormLabel>
                <Input
                  isDisabled={disabledInputs.upi}
                  name="upi"
                  value={Formik.values.upi}
                  onChange={Formik.handleChange}
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  MICR (optional)
                </FormLabel>
                <Input
                  isDisabled={disabledInputs.micr}
                  name="micr"
                  value={Formik.values.micr}
                  onChange={Formik.handleChange}
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
          </Stack>

          <Text fontSize={"lg"} pb={8}>
            ADDRESS
          </Text>
          <FormControl w={"full"} pb={8}>
            <Box w={"full"}>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                Street
              </FormLabel>
              <Input
                isDisabled={disabledInputs.line}
                name="street"
                value={addressObj.line}
                onChange={(e) =>
                  setAddressObj({ ...addressObj, line: e.target.value })
                }
                bg={"blanchedalmond"}
                w={["full", "full"]}
              />
            </Box>
          </FormControl>
          <Stack
            pb={16}
            gap={8}
            direction={["column", "row"]}
            justifyContent={"space-between"}
          >
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  Landmark
                </FormLabel>
                <Input
                  isDisabled={disabledInputs.landmark}
                  name="landmark"
                  value={addressObj.landmark}
                  onChange={(e) =>
                    setAddressObj({ ...addressObj, landmark: e.target.value })
                  }
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  City
                </FormLabel>
                <Input
                  isDisabled={disabledInputs.city}
                  name="city"
                  value={addressObj.city}
                  onChange={(e) =>
                    setAddressObj({ ...addressObj, city: e.target.value })
                  }
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  State
                </FormLabel>
                <Input
                  isDisabled={disabledInputs.state}
                  name="state"
                  value={addressObj.state}
                  onChange={(e) =>
                    setAddressObj({ ...addressObj, state: e.target.value })
                  }
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
          </Stack>
          <Stack
            gap={8}
            direction={["column", "row"]}
            justifyContent={"space-between"}
          >
            <FormControl>
              <Box>
                <FormLabel
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  fontSize={"lg"}
                >
                  Pin Code
                </FormLabel>
                <Input
                  isDisabled={disabledInputs.pincode}
                  name="pincode"
                  value={addressObj.pincode}
                  onChange={(e) =>
                    setAddressObj({ ...addressObj, pincode: e.target.value })
                  }
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                />
              </Box>
            </FormControl>
          </Stack>

          <br />
          <br />
          <Stack
            w={"full"}
            pb={16}
            direction={["column", "row"]}
            justifyContent={"space-between"}
          >
            <FormControl>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                UPLOAD PDF
              </FormLabel>
              <HStack>
                <Input
                  isDisabled={disabledInputs.attachment1}
                  type="file"
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                  name="attachment1"
                  onChange={(e) =>
                    Formik.setFieldValue(
                      "attachment1",
                      e.currentTarget.files[0]
                    )
                  }
                />
                <Input
                  isDisabled={disabledInputs.attachment2}
                  type="file"
                  bg={"blanchedalmond"}
                  w={["full", "xs"]}
                  name="attachment2"
                  onChange={(e) =>
                    Formik.setFieldValue(
                      "attachment2",
                      e.currentTarget.files[0]
                    )
                  }
                />
              </HStack>
            </FormControl>
          </Stack>

          <HStack>
            <Checkbox required />
            <Text>
              I have read and accept the Terms & Conditions and Privacy Policy
              of Virolife Foundation With All My Attention
            </Text>
          </HStack>

          <HStack justifyContent={"flex-end"}>
            <Button
              rightIcon={<BsArrowRight />}
              colorScheme="yellow"
              type="submit"
            >
              Proceed
            </Button>
          </HStack>
        </Box>
      </form>
    </>
  );
};

export default Info;
