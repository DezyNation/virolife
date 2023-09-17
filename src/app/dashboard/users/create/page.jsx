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
  Select,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { BsArrowRight } from "react-icons/bs";
import { useFormik } from "formik";
import BackendAxios, { FormAxios } from "@/utils/axios";

const Info = () => {
  const Toast = useToast({ position: "top-right" });
  const [gender, setGender] = useState("");
  const [addressObj, setAddressObj] = useState({
    line: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [agents, setAgents] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [myId, setMyId] = useState("");
  const [myName, setMyName] = useState("");
  const [myRole, setMyRole] = useState("distributor");

  useEffect(() => {
    setMyRole(localStorage.getItem("myRole"));
    setMyName(localStorage.getItem("userName"));
    setMyId(localStorage.getItem("userId"));
  }, []);

  const Formik = useFormik({
    initialValues: {
      role: "",
      password: "",
      firstName: "",
      middleName: "",
      lastName: "",
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
      agent: "",
      distributor: "",
    },
    onSubmit: (values) => {
      FormAxios.post(`/api/agent/user/register-user`, {
        ...values,
        address: JSON.stringify(addressObj),
        password_confirmation: Formik.values.password,
        name:
          values.firstName +
          (values.middleName && values.lastName
            ? ` ${values.middleName} ${values.lastName}`
            : !values.middleName && values.lastName && ` ${values.lastName}`),
      })
        .then((res) => {
          Toast({
            status: "success",
            description: "User created successfully!",
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
    if (myRole == "distributor") {
      Formik.setFieldValue("distributor", myId);
    }
    if (myRole == "agent") {
      Formik.setFieldValue("agent", myId);
    }
  }, [myName, myId, myRole]);

  return (
    <>
      <form action="#" onSubmit={Formik.handleSubmit}>
        <Box p={8}>
          <Stack
            direction={["column", "row"]}
            alignItems={"center"}
            justifyContent={"flex-start"}
            gap={8}
          >
            <FormControl w={["full", "xs"]} mb={8}>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                User Role
              </FormLabel>
              <Select
                name="role"
                placeholder="Please Select"
                onChange={Formik.handleChange}
              >
                {myRole == "agent" ? (
                  <option value="user">Member</option>
                ) : myRole == "distributor" ? (
                  <option value="agent">Agent</option>
                ) : null}
              </Select>
            </FormControl>
          </Stack>
          <br />
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
                  rounded={"full"}
                  colorScheme="yellow"
                  onClick={() => setGender("male")}
                  variant={gender == "male" ? "solid" : "outline"}
                >
                  M
                </Button>
                <Button
                  rounded={"full"}
                  colorScheme="yellow"
                  onClick={() => setGender("female")}
                  variant={gender == "female" ? "solid" : "outline"}
                >
                  F
                </Button>
                <Button
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
                bg={"blanchedalmond"}
                w={["full", "xs"]}
                type="date"
                name="dob"
                value={Formik.values.dob}
                onChange={Formik.handleChange}
              />
            </Box>
          </Stack>

          <Stack
            w={"full"}
            gap={8}
            pb={16}
            direction={["column", "row"]}
            justifyContent={"flex-start"}
          >
            <FormControl w={["full", "xs"]}>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                CONTACT NO
              </FormLabel>
              <Input
                bg={"blanchedalmond"}
                w={["full", "xs"]}
                name="phone"
                value={Formik.values.phone}
                onChange={Formik.handleChange}
              />
            </FormControl>
            <FormControl w={["full", "xs"]}>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                EMAIL ID
              </FormLabel>
              <Input
                bg={"blanchedalmond"}
                w={["full", "xs"]}
                name="email"
                type="email"
                onChange={Formik.handleChange}
                value={Formik.values.email}
              />
            </FormControl>
            <FormControl w={["full", "xs"]}>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                PASSWORD
              </FormLabel>
              <Input
                bg={"blanchedalmond"}
                w={["full", "xs"]}
                name="password"
                onChange={Formik.handleChange}
                value={Formik.values.password}
              />
            </FormControl>
          </Stack>

          <Text fontSize={"lg"} pb={8}>
            BANKING DETAILS
          </Text>
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
                  ACCOUNT NUMBER
                </FormLabel>
                <Input
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
            w={"full"}
            pb={16}
            gap={8}
            direction={["column", "row"]}
            justifyContent={"flex-start"}
          >
            <FormControl w={["full", "xs"]}>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                UPI ID
              </FormLabel>
              <Input
                name="upi"
                value={Formik.values.upi}
                onChange={Formik.handleChange}
                bg={"blanchedalmond"}
                w={["full", "xs"]}
              />
            </FormControl>
            <FormControl w={["full", "xs"]}>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                MICR (optional)
              </FormLabel>
              <Input
                name="micr"
                value={Formik.values.micr}
                onChange={Formik.handleChange}
                bg={"blanchedalmond"}
                w={["full", "xs"]}
              />
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
            w={"full"}
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
                  Landmark
                </FormLabel>
                <Input
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
            direction={["column", "row"]}
            alignItems={"center"}
            justifyContent={"flex-start"}
            pt={8}
            gap={8}
          >
            <FormControl>
              <FormLabel
                fontWeight={"bold"}
                textTransform={"uppercase"}
                fontSize={"lg"}
              >
                Pin Code
              </FormLabel>
              <Input
                name="pincode"
                value={addressObj.pincode}
                onChange={(e) =>
                  setAddressObj({ ...addressObj, pincode: e.target.value })
                }
                bg={"blanchedalmond"}
                w={["full", "xs"]}
              />
            </FormControl>
          </Stack>

          <br />
          <br />
          <Stack
            w={"full"}
            pb={16}
            direction={["column", "row"]}
            justifyContent={"flex-start"}
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

          <HStack justifyContent={"flex-end"}>
            <Button
              rightIcon={<BsArrowRight />}
              colorScheme="yellow"
              type="submit"
            >
              Create
            </Button>
          </HStack>
        </Box>
      </form>
    </>
  );
};

export default Info;
