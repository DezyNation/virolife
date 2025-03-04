"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  Spacer,
  useDisclosure,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  Input,
  FormLabel,
  Stack,
  VStack,
  Image,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  useToast,
  InputGroup,
  InputRightElement,
  DrawerFooter,
  InputLeftElement,
  NumberInputField,
  NumberInput,
} from "@chakra-ui/react";
import Link from "next/link";
import { BiMenuAltLeft } from "react-icons/bi";
import { useFormik } from "formik";
import BackendAxios, { DefaultAxios, FormAxios } from "@/utils/axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Cookies from "js-cookie";
import { isExpired } from "react-jwt";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const Navbar = () => {
  const Toast = useToast({ position: "top-right" });
  const { isOpen, onToggle } = useDisclosure();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState(null);
  const [myRole, setMyRole] = useState("");
  const [isPasswordVisible, setisPasswordVisible] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const [signupSuccessModal, setSignupSuccessModal] = useState(false);
  const [seniorInfo, setSeniorInfo] = useState({});
  const Router = useRouter();

  const params = useSearchParams();
  const referralId = params.get("ref_id");
  const emailFromParams = params.get("email");
  const intentFromParams = params.get("intent");
  const nameFromParams = params.get("name");
  const phoneFromParams = params.get("phone");

  const [isSeniorInputDisabled, setIsSeniorInputDisabled] = useState(false);

  const [code, setCode] = useState(params.get("ref_id"));
  const [websiteData, setWebsiteData] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content`)
      .then((res) => {
        const parsedData = JSON.parse(res.data[0]?.content);
        setWebsiteData(parsedData);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  const Formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      phone_number: "",
    },
  });

  useEffect(() => {
    if (isExpired(Cookies.get("jwt"))) {
      setSessionExpired(true);
    } else {
      setSessionExpired(false);
    }
  }, [Cookies.get()]);

  useEffect(() => {
    if (!intentFromParams && !params.get("ref_id")) return;
    if (intentFromParams == "register") {
      Formik.setFieldValue("email", emailFromParams ? emailFromParams : "");
      Formik.setFieldValue("password", phoneFromParams ? phoneFromParams : "");
      Formik.setFieldValue(
        "phone_number",
        phoneFromParams ? phoneFromParams : ""
      );
      setFirstName(nameFromParams ? nameFromParams : "");
    }
    setCode(referralId);
    if (referralId) {
      setIsSeniorInputDisabled(true);
      getUserInfo();
    }
    setIsSignupOpen(true);
  }, [params]);

  function getUserInfo() {
    BackendAxios.get(`/api/users/${code}`)
      .then((res) => {
        if (res.data?.length) {
          setSeniorInfo(res.data[0]);
        } else {
          Toast({
            description: "Invalid senior ID",
          });
        }
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function handleLogin() {
    if (!Formik.values.email || !Formik.values.password) {
      Toast({
        description: "Email and password must not be empty",
      });
      return;
    }
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
        ...Formik.values,
      })
      .then((res) => {
        Toast({
          status: "success",
          description: "Login successful!",
        });
        BackendAxios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data?.access_token}`;
        FormAxios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data?.access_token}`;
        Cookies.set("jwt", res.data?.access_token);
        // setCookie("jwt", res.data?.access_token);
        onToggle();
        Router.push("/dashboard");
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function handleSignup() {
    if (!Formik.values.email || !Formik.values.password) {
      Toast({
        description: "Email and password must not be empty",
      });
      return;
    }
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
        ...Formik.values,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        name: firstName + " " + middleName + (middleName ? " " : "") + lastName,
        password_confirmation: Formik.values.password,
        phone_number: Formik.values.phone_number,
        code: code,
      })
      .then((res) => {
        Toast({
          status: "success",
          description: "Signup successful!",
        });
        setIsSignupOpen(false);
        setSignupSuccessModal(true);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function handleLogout() {
    BackendAxios.post("/logout")
      .then((res) => {
        Cookies.remove("jwt");
        localStorage.clear();
        Router.replace("/");
      })
      .catch((err) => {
        Cookies.remove("jwt");
        localStorage.clear();
        Router.replace("/");
      });
  }

  useEffect(() => {
    if (!isExpired(cookies.jwt)) {
      BackendAxios.get("/auth-user")
        .then((res) => {
          setUserName(res.data[0]?.name);
          setUserData(res.data[0]);
          localStorage.setItem(
            "myRole",
            res.data[0]?.roles?.length ? res.data[0]?.roles[0]?.name : ""
          );
          setMyRole(
            res.data[0]?.roles?.length ? res.data[0]?.roles[0]?.name : ""
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <>
      <Box
        w={"full"}
        mx={"auto"}
        p={4}
        borderBottom={"1px"}
        borderBottomColor={"yellow.500"}
      >
        <Flex
          w={["full"]}
          alignItems="center"
          display={{ base: "none", md: "flex" }}
        >
          <HStack spacing={8} fontWeight={"medium"}>
            <Link href={"/"}>
              <Image src="/logo.png" width={16} />
            </Link>
            <Link href={"/about-us"}>
              <Box fontSize={"lg"} mr={4} className="serif">
                About Us
              </Box>
            </Link>
            {sessionExpired ? (
              <Box
                cursor={"pointer"}
                fontSize={"lg"}
                mr={4}
                className="serif"
                onClick={onToggle}
              >
                Login
              </Box>
            ) : null}
            {!sessionExpired ? (
              <Link href={"/dashboard"}>
                <Box
                  cursor={"pointer"}
                  fontSize={"lg"}
                  mr={4}
                  className="serif"
                >
                  Dashboard
                </Box>
              </Link>
            ) : null}
          </HStack>
          <Spacer />
          {websiteData?.whatsappStatus ? (
            <Link href={websiteData?.whatsappLink} target="_blank">
              <HStack>
                <Image
                  src="/whatsapp.png"
                  boxSize={"8"}
                  objectFit={"contain"}
                />
                <Text
                  cursor={"pointer"}
                  fontSize={"xl"}
                  className="serif"
                  fontWeight={"bold"}
                  color={"#666"}
                >
                  Join Group
                </Text>
              </HStack>
            </Link>
          ) : null}
          {websiteData?.telegramStatus && websiteData?.whatsappStatus ? (
            <Spacer w={24} />
          ) : null}
          {websiteData?.telegramStatus ? (
            <Link href={websiteData?.telegramLink} target="_blank">
              <HStack>
                <Image
                  src="/telegram.png"
                  boxSize={"8"}
                  objectFit={"contain"}
                />
                <Text
                  cursor={"pointer"}
                  fontSize={"xl"}
                  className="serif"
                  fontWeight={"bold"}
                  color={"#666"}
                >
                  Join Group
                </Text>
              </HStack>
            </Link>
          ) : null}
          <Spacer />
          <HStack spacing={8} fontWeight={"medium"}>
            <Box>
              <Text color={"transparent"}>Virolife</Text>
            </Box>
            <Link href={"/blogs"}>
              <Box cursor={"pointer"} mr={4} fontSize={"lg"} className="serif">
                Blog
              </Box>
            </Link>
            {/* {sessionExpired ? null : myRole == "user" ? (
              <Link href={"/store"}>
                <Box
                  cursor={"pointer"}
                  mr={4}
                  fontSize={"lg"}
                  className="serif"
                >
                  Redeem Points
                </Box>
              </Link>
            ) : null} */}
            <Link href={"/store"}>
              <Box cursor={"pointer"} mr={4} fontSize={"lg"} className="serif">
                Redeem Points
              </Box>
            </Link>
            <Link href={"/contact"}>
              <Box cursor={"pointer"} mr={4} fontSize={"lg"} className="serif">
                Contact
              </Box>
            </Link>
          </HStack>
        </Flex>
        <Flex
          w={["full"]}
          alignItems="center"
          display={{ base: "flex", md: "none" }}
        >
          <BiMenuAltLeft
            size={24}
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          />
          <Spacer />
          <Link href={"/"}>
            <Box cursor={"pointer"}>
              <Text
                fontSize={"lg"}
                className="serif"
                fontWeight={"bold"}
                color={"#666"}
              >
                Virolife
              </Text>
            </Box>
          </Link>
        </Flex>
      </Box>

      <Drawer
        size={"xs"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <Link href={"/"}>
              <Image src="/logo.png" width={16} />
              <br />
              <Text fontSize={"sm"}>{userName}</Text>
            </Link>
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody>
            <VStack gap={4} p={4} w={"full"} alignItems={"flex-start"}>
              <Text>Home</Text>
              {sessionExpired ? <Text onClick={onToggle}>Login</Text> : null}
              {sessionExpired ? (
                <Text onClick={() => setIsSignupOpen(true)}>Signup</Text>
              ) : null}
              {!sessionExpired ? (
                <VStack gap={4} alignItems={"flex-start"} w={"full"}>
                  <Link href={"/dashboard/profile"}>
                    <Text>Profile</Text>
                  </Link>
                  <Link href={"/dashboard"}>
                    <Text>Dashboard</Text>
                  </Link>
                  {myRole == "user" ? (
                    <VStack gap={4} alignItems={"flex-start"} w={"full"}>
                      <Link href={"/dashboard/campaigns"}>
                        <Text>My Campaigns</Text>
                      </Link>
                      <Link href={"/dashboard/collection"}>
                        <Text>Collection</Text>
                      </Link>
                      <Link href={"/dashboard/groups"}>
                        <Text>Groups</Text>
                      </Link>
                      <Link href={"/dashboard/target"}>
                        <Text>Target List</Text>
                      </Link>
                      <Link href={"/dashboard/team-funding"}>
                        <Text>Veero Team Funding</Text>
                      </Link>
                      <Link href={"/dashboard/all-team"}>
                        <Text>All Team Funding</Text>
                      </Link>
                      <br />
                      <Link href={"/dashboard/gift-cards"}>
                        <HStack gap={4}>
                          <Text>Gift Cards</Text>
                        </HStack>
                      </Link>
                      <Link href={"/dashboard/points/transfers"}>
                        <HStack gap={4}>
                          <Text>Point Transfers</Text>
                        </HStack>
                      </Link>
                      <Link href={"/dashboard/points/withdrawals"}>
                        <HStack gap={4}>
                          <Text>Point Withdrawals</Text>
                        </HStack>
                      </Link>
                      <br />
                      <Link href={"/dashboard/campaign-donations"}>
                        <HStack gap={4}>
                          <Text>Campaign Donations</Text>
                        </HStack>
                      </Link>
                      <Link href={"/dashboard/orders"}>
                        <HStack gap={4}>
                          <Text>Ecom Orders</Text>
                        </HStack>
                      </Link>
                      <Link href={"/dashboard/transactions"}>
                        <HStack gap={4}>
                          <Text>Transactions</Text>
                        </HStack>
                      </Link>
                    </VStack>
                  ) : (
                    <Link href={"/dashboard/users"}>
                      <Text>Manage Users</Text>
                    </Link>
                  )}
                </VStack>
              ) : null}
              <Link href={"/blogs"}>
                <Text>Blog</Text>
              </Link>
              <br />
              <Link href={"/store"}>
                <Text>Redeem Points</Text>
              </Link>
              <HStack w={"full"}>
                <Image
                  src="/whatsapp.png"
                  boxSize={"8"}
                  objectFit={"contain"}
                />
                <Text
                  cursor={"pointer"}
                  fontSize={["lg", "xl"]}
                  className="serif"
                  fontWeight={"bold"}
                  color={"#666"}
                >
                  Join Group
                </Text>
              </HStack>
              <HStack w={"full"}>
                <Image
                  src="/telegram.png"
                  boxSize={"8"}
                  objectFit={"contain"}
                />
                <Text
                  cursor={"pointer"}
                  fontSize={["lg", "xl"]}
                  className="serif"
                  fontWeight={"bold"}
                  color={"#666"}
                >
                  Join Group
                </Text>
              </HStack>
              <Link href={"/contact"}>
                <Text>Contact Us</Text>
              </Link>
            </VStack>
          </DrawerBody>
          <DrawerFooter justifyContent={"center"}>
            {sessionExpired ? null : (
              <Text textAlign={"center"} onClick={handleLogout}>
                Logout
              </Text>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Login Popup */}
      <Modal isOpen={isOpen} isCentered={true} onClose={onToggle} size={"4xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={12}>
            <Stack direction={["column", "row"]} gap={8}>
              <VStack gap={8}>
                <FormControl>
                  <Stack
                    direction={["column", "row"]}
                    spacing={8}
                    justifyContent={"space-between"}
                  >
                    <FormLabel fontSize={"xl"}>Email/ID</FormLabel>
                    <Input
                      w={["full", "xs"]}
                      placeholder="Your Email"
                      type="email"
                      boxShadow={"xl"}
                      border={".5px solid #FAFAFA"}
                      rounded={0}
                      name="email"
                      onChange={Formik.handleChange}
                    />
                  </Stack>
                </FormControl>
                <FormControl>
                  <Stack direction={["column", "row"]} spacing={8}>
                    <FormLabel fontSize={"xl"}>Password</FormLabel>
                    <Box>
                      <InputGroup pb={2}>
                        <Input
                          w={["full", "xs"]}
                          placeholder="Password"
                          type={isPasswordVisible ? "text" : "password"}
                          boxShadow={"xl"}
                          border={".5px solid #FAFAFA"}
                          rounded={0}
                          name="password"
                          onChange={Formik.handleChange}
                        />
                        <InputRightElement
                          children={
                            isPasswordVisible ? (
                              <AiOutlineEyeInvisible />
                            ) : (
                              <AiOutlineEye />
                            )
                          }
                          onClick={() =>
                            setisPasswordVisible(!isPasswordVisible)
                          }
                        />
                      </InputGroup>
                      <Link href={"/forgot-password"}>
                        <Text
                          fontWeight={"semibold"}
                          fontSize={"xs"}
                          color={"blue"}
                          w={"full"}
                          textAlign={"right"}
                        >
                          Forgot Password?
                        </Text>
                      </Link>
                    </Box>
                  </Stack>
                </FormControl>
                <Box
                  px={8}
                  py={4}
                  textAlign={"right"}
                  cursor={"pointer"}
                  onClick={() => {
                    onToggle();
                    setIsSignupOpen(true);
                  }}
                >
                  <Text color={"#444"} fontSize={"lg"} fontWeight={"semibold"}>
                    Don't Have An Account? &nbsp;&nbsp; Register here
                  </Text>
                </Box>
                <HStack>
                  <Button
                    colorScheme="yellow"
                    variant={"outline"}
                    onClick={onToggle}
                  >
                    Cancel
                  </Button>
                  <Button colorScheme="yellow" onClick={handleLogin}>
                    Continue
                  </Button>
                </HStack>
              </VStack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Signup Popup */}
      <Modal
        isOpen={isSignupOpen}
        isCentered={true}
        onClose={() => setIsSignupOpen(!isSignupOpen)}
        size={"4xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={[8, 12]}>
            <Stack direction={["column", "row"]} gap={[4, 8]}>
              <VStack gap={8}>
                <FormControl>
                  <Stack
                    direction={["column", "row"]}
                    spacing={[4, 8]}
                    justifyContent={"space-between"}
                  >
                    <FormLabel fontSize={"xl"}>First Name</FormLabel>
                    <Input
                      w={["full", "xs"]}
                      placeholder="Your First Name"
                      boxShadow={"xl"}
                      border={".5px solid #FAFAFA"}
                      rounded={0}
                      onChange={(e) => setFirstName(e.target.value)}
                      value={firstName}
                    />
                  </Stack>
                </FormControl>
                <FormControl>
                  <Stack
                    direction={["column", "row"]}
                    spacing={[4, 8]}
                    justifyContent={"space-between"}
                  >
                    <FormLabel fontSize={"xl"}>Middle Name</FormLabel>
                    <Input
                      w={["full", "xs"]}
                      placeholder="Your Middle Name"
                      boxShadow={"xl"}
                      border={".5px solid #FAFAFA"}
                      rounded={0}
                      onChange={(e) => setMiddleName(e.target.value)}
                      value={middleName}
                    />
                  </Stack>
                </FormControl>
                <FormControl>
                  <Stack
                    direction={["column", "row"]}
                    spacing={[4, 8]}
                    justifyContent={"space-between"}
                  >
                    <FormLabel fontSize={"xl"}>Last Name</FormLabel>
                    <Input
                      w={["full", "xs"]}
                      placeholder="Your Last Name"
                      boxShadow={"xl"}
                      border={".5px solid #FAFAFA"}
                      rounded={0}
                      onChange={(e) => setLastName(e.target.value)}
                      value={lastName}
                    />
                  </Stack>
                </FormControl>
                <FormControl>
                  <Stack
                    direction={["column", "row"]}
                    spacing={[4, 8]}
                    justifyContent={"space-between"}
                  >
                    <FormLabel fontSize={"xl"}>Email</FormLabel>
                    <Input
                      w={["full", "xs"]}
                      placeholder="Your Email"
                      type="email"
                      name="email"
                      onChange={Formik.handleChange}
                      boxShadow={"xl"}
                      border={".5px solid #FAFAFA"}
                      rounded={0}
                      value={Formik.values.email}
                    />
                  </Stack>
                </FormControl>
                <FormControl>
                  <Stack
                    direction={["column", "row"]}
                    spacing={[4, 8]}
                    justifyContent={"space-between"}
                  >
                    <FormLabel fontSize={"xl"}>Phone</FormLabel>
                    <NumberInput
                      value={Formik.values.phone_number}
                      boxShadow={"xl"}
                      border={".5px solid #FAFAFA"}
                      w={["full", "xs"]}
                      rounded={0}
                      max={9999999999}
                    >
                      <NumberInputField
                        name="phone_number"
                        onChange={Formik.handleChange}
                        placeholder="Phone Number"
                      />
                    </NumberInput>
                  </Stack>
                </FormControl>
                <FormControl>
                  <Stack
                    direction={["column", "row"]}
                    spacing={[4, 8]}
                    justifyContent={"space-between"}
                  >
                    <FormLabel fontSize={"xl"}>Password</FormLabel>
                    <InputGroup w={["full", "xs"]}>
                      <Input
                        placeholder="Password"
                        type={isPasswordVisible ? "text" : "password"}
                        boxShadow={"xl"}
                        border={".5px solid #FAFAFA"}
                        rounded={0}
                        name="password"
                        value={Formik.values.password}
                        onChange={Formik.handleChange}
                      />
                      <InputRightElement
                        children={
                          isPasswordVisible ? (
                            <AiOutlineEyeInvisible />
                          ) : (
                            <AiOutlineEye />
                          )
                        }
                        onClick={() => setisPasswordVisible(!isPasswordVisible)}
                      />
                    </InputGroup>
                  </Stack>
                </FormControl>
                <FormControl>
                  <Stack
                    direction={["column", "row"]}
                    spacing={[4, 8]}
                    justifyContent={"space-between"}
                  >
                    <Box>
                      <FormLabel fontSize={"xl"}>Senior ID</FormLabel>
                      <Text fontSize={"xs"}>(optional)</Text>
                    </Box>

                    <Box>
                      <InputGroup w={["full", "xs"]}>
                        <InputLeftElement
                          onClick={getUserInfo}
                          children={
                            <Text cursor={"pointer"} fontSize={"sm"}>
                              {process.env.NEXT_PUBLIC_CODE}
                            </Text>
                          }
                          paddingX={4}
                        />
                        <Input
                          placeholder="Senior ID"
                          boxShadow={"xl"}
                          border={".5px solid #FAFAFA"}
                          rounded={0}
                          value={code}
                          isDisabled={isSeniorInputDisabled}
                          onChange={(e) => setCode(e.target.value)}
                        />
                        <InputRightElement
                          onClick={getUserInfo}
                          children={
                            <Text
                              cursor={"pointer"}
                              fontSize={"xs"}
                              color={"twitter.500"}
                            >
                              Verify
                            </Text>
                          }
                          paddingRight={4}
                        />
                      </InputGroup>
                      <Text fontSize={"xs"}>
                        {seniorInfo?.name}{" "}
                        {seniorInfo?.primary_plan_name
                          ? `(Plan ${seniorInfo?.primary_plan_name})`
                          : ""}
                      </Text>
                    </Box>
                  </Stack>
                </FormControl>
                <Text fontSize={"sm"}>
                  By signing up, you accept our terms and conditions. You also
                  affirm that you are above 18 years of age.
                </Text>
                <Box
                  px={8}
                  py={4}
                  textAlign={"right"}
                  cursor={"pointer"}
                  onClick={() => {
                    onToggle();
                    setIsSignupOpen(false);
                  }}
                >
                  <Text color={"#444"} fontSize={"lg"} fontWeight={"semibold"}>
                    Already Have An Account? &nbsp;&nbsp; Login here
                  </Text>
                </Box>
                <HStack>
                  <Button
                    colorScheme="yellow"
                    variant={"outline"}
                    onClick={() => setIsSignupOpen(!isSignupOpen)}
                  >
                    Cancel
                  </Button>
                  <Button colorScheme="yellow" onClick={handleSignup}>
                    Continue
                  </Button>
                </HStack>
              </VStack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Signup success modal */}
      <Modal
        isOpen={signupSuccessModal}
        onClose={() => setSignupSuccessModal(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text
              textAlign={"center"}
              fontWeight={"semibold"}
              color={"whatsapp.500"}
            >
              Sign Up Successful!
            </Text>
          </ModalHeader>
          <ModalBody>
            <Text>
              Congratulations! Your ID was created successfully. Please use
              these details to login.
            </Text>
            <Text>Email: {Formik.values.email}</Text>
            <Text>Password: {Formik.values.password}</Text>
          </ModalBody>
          <ModalFooter>
            <HStack w={"full"} justifyContent={"flex-end"}>
              <Button>Okay!</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Navbar;
