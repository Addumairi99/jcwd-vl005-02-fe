import React, { useState, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Axios from "axios";
import {
  Box,
  Checkbox,
  Link,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  useBreakpointValue,
  IconProps,
  Icon,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  useToast
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { Link as ReactLink } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function UserLogin() {
  const username = useRef("");
  const password = useRef("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onButtonLogin = () => {
    setLoading(true);
    Axios.post(API_URL + `/users/login`, {
      username: username.current.value,
      password: password.current.value
    })
      .then(respond => {
        console.log(respond.data);
        setLoading(false);
        // if success =>
        toast({
          title: "Login Success",
          // description:"Email & password doesn't found. ",
          status: "success",
          duration: 3000,
          isClosable: true
        });
        console.log(respond.data.token);
        // save token to local storage
        localStorage.setItem("token", respond.data.token);
        console.log(respond.data.dataLogin);

        // save user data to global state
        dispatch({ type: "LOGIN", payload: respond.data.dataLogin });

        //  redirect to home page
        toast({
          title: "Login Success",
          status: "success",
          duration: 3000,
          isClosable: true
        });
        navigate("/");
      })
      .catch(error => {
        console.log(error);
        toast({
          title: "Error",
          description: error.response.data,
          status: "error",
          duration: 3000,
          isClosable: true
        });
        setLoading(false);
      });
  };

  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/" />;

  return (
    <Box position={"relative"}>
      <Container
        as={SimpleGrid}
        maxW={"7xl"}
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}
      >
        <Stack spacing={{ base: 10, md: 20 }}>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
          >
            Pharmacy Store 
            <Text
              as={"span"}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text"
            ></Text>{" "}
          </Heading>
          <Stack direction={"row"} spacing={4} align={"center"}></Stack>
        </Stack>
        <Stack
          bg={"gray.50"}
          rounded={"xl"}
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
          maxW={{ lg: "lg" }}
        >
          <Stack spacing={4}>
            <Heading
              color={"gray.800"}
              lineHeight={1.1}
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            >
              Sign in to your account
              <Text
                as={"span"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
              >
                !
              </Text>
            </Heading>
            {/* <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
              We’re looking for amazing engineers just like you! Become a part
              of our rockstar engineering team and skyrocket your career!
            </Text> */}
          </Stack>
          <Box as={"form"} mt={10}>
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email or Username </FormLabel>
                <Input ref={username} type="text" />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    ref={password}
                    type={showPassword ? "text" : "password"}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword(showPassword => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Stack>
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"flex-end"}
            >
              {/* <Checkbox>Remember me</Checkbox> */}
              <Link as={ReactLink} to="/forgotpassword" color={"blue.400"}>
                Forgot password?
              </Link>
            </Stack>
            <Button
              fontFamily={"heading"}
              mt={8}
              w={"full"}
              bgGradient="linear(to-r, red.400,pink.400)"
              color={"white"}
              _hover={{
                bgGradient: "linear(to-r, red.400,pink.400)",
                boxShadow: "xl"
              }}
              onClick={onButtonLogin}
            >
              Login
            </Button>
          </Box>
          form
        </Stack>
      </Container>
      <Blur
        position={"absolute"}
        top={-10}
        left={-10}
        style={{ filter: "blur(70px)" }}
      />
    </Box>
  );
}

export const Blur = IconProps => {
  return (
    <Icon
      width={useBreakpointValue({ base: "100%", md: "40vw", lg: "30vw" })}
      zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
      height="560px"
      viewBox="0 0 528 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...IconProps}
    >
      <circle cx="71" cy="61" r="111" fill="#F56565" />
      <circle cx="244" cy="106" r="139" fill="#ED64A6" />
      <circle cy="291" r="139" fill="#ED64A6" />
      <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
      <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
      <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
      <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
    </Icon>
  );
};