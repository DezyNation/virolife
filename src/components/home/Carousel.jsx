"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Image,
  Stack,
  Button,
  VStack,
  HStack,
  useDisclosure,
  InputGroup,
  Input,
  InputRightElement,
  FormLabel,
  FormControl,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import BackendAxios from "@/utils/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "react-cookie";
import { useFormik } from "formik";
import { isExpired } from "react-jwt";

const Carousel = () => {
  const Toast = useToast({ position: "top-right" });
  const { isOpen, onToggle } = useDisclosure();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const Router = useRouter();
  const [sessionExpired, setSessionExpired] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    setSessionExpired(isExpired(cookies.jwt));
  }, [cookies]);

  const Formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      phone: "",
      name: "",
    },
  });

  function handleLogin() {
    if (!Formik.values.email || !Formik.values.password) {
      Toast({
        description: "Email and password must not be empty",
      });
      return;
    }
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
        email: Formik.values.email,
        password: Formik.values.password,
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
        // Cookies.set("jwt", res.data?.access_token)
        setCookie("jwt", res.data?.access_token);
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

  function sendInvite() {
    if(!Formik.values.name || !Formik.values.phone || !Formik.values.email){
      Toast({
        description: "All fields are required"
      })
      return
    }
    BackendAxios.post(`/invitation`, {
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}?intent=register&name=${Formik.values.name.replace(/ /g, "%20")}&email=${Formik.values.email}&phone=${Formik.values.phone}`,
      name: Formik.values.name,
      email: Formik.values.email,
      phone: Formik.values.phone,
    })
      .then((res) => {
        Toast({
          status: "success",
          title: "Email sent!",
          description: "Please check your inbox for invitation.",
        });
        setIsSignupOpen(false);
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Notification while sending invitation",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
        setIsSignupOpen(false);
      });
  }

  return (
    <>
      <Box w={"full"}>
        <Stack
          p={8}
          direction={["column", "row"]}
          justifyContent={"space-between"}
        >
          <Image w={["full", "4xl"]} objectFit={"contain"} src="/hero.png" />
          <VStack>
            <Text
              fontSize={["3xl", "5xl", "6xl"]}
              className="serif"
              textAlign={["center", "right"]}
            >
              We Know You
              <br />
              Need Funds
            </Text>
            <Button
              mt={12}
              fontSize={"xl"}
              rounded={6}
              size={"lg"}
              bgColor={"yellow.400"}
              fontWeight={"semibold"}
              color={"#333"}
              onClick={() => {
                sessionExpired
                  ? setIsSignupOpen(true)
                  : Router.push("/dashboard/campaigns/create");
              }}
            >
              Let's Start a Fund Raiser
            </Button>
          </VStack>
        </Stack>
        <Box w={"90vw"} h={"0.5"} mx={"auto"} bgColor={"yellow.400"}></Box>
      </Box>

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
                    <FormLabel fontSize={"md"}>Email</FormLabel>
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
                    <FormLabel fontSize={"md"}>Password</FormLabel>
                    <InputGroup>
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
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      />
                    </InputGroup>
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
        size={"xl"}
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
                    <FormLabel fontSize={"md"}>Name</FormLabel>
                    <Input
                      w={["full", "xs"]}
                      placeholder="Your Full Name"
                      name="name"
                      boxShadow={"xl"}
                      border={".5px solid #FAFAFA"}
                      rounded={0}
                      onChange={Formik.handleChange}
                    />
                  </Stack>
                </FormControl>
                <FormControl>
                  <Stack
                    direction={["column", "row"]}
                    spacing={[4, 8]}
                    justifyContent={"space-between"}
                  >
                    <FormLabel fontSize={"md"}>Email</FormLabel>
                    <Input
                      w={["full", "xs"]}
                      placeholder="Your Email"
                      type="email"
                      name="email"
                      onChange={Formik.handleChange}
                      boxShadow={"xl"}
                      border={".5px solid #FAFAFA"}
                      rounded={0}
                    />
                  </Stack>
                </FormControl>
                <FormControl>
                  <Stack
                    direction={["column", "row"]}
                    spacing={[4, 8]}
                    justifyContent={"space-between"}
                  >
                    <FormLabel fontSize={"md"}>Phone Number</FormLabel>
                    <Input
                      w={["full", "xs"]}
                      placeholder="Phone Number"
                      type="tel"
                      name="phone"
                      onChange={Formik.handleChange}
                      boxShadow={"xl"}
                      border={".5px solid #FAFAFA"}
                      rounded={0}
                    />
                  </Stack>
                </FormControl>
                <Text fontSize={'sm'} textAlign={'center'}>By signing up, you accept our terms and conditions. You also affirm that you are above 18 years of age.</Text>
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
                  <Button colorScheme="yellow" onClick={sendInvite}>
                    Continue
                  </Button>
                </HStack>
              </VStack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Carousel;
