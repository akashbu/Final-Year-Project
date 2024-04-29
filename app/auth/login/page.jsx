"use client";

import {
  Button,
  Checkbox,
  Flex,
  Text,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  Spinner,
  useToast 
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Auth() {
  const router = useRouter();
  const [logging, setLogging] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const toast = useToast(); 

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    setLogging(true);
    let formValid = true;
    const newErrors = {};
    for (const field in formData) {
      if (!formData[field]) {
        formValid = false;
        newErrors[field] = "Field cannot be empty";
      }
    }
    setErrors(newErrors);

    if (formValid) {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.token); // User Sign Up Successful
          localStorage.setItem("token", data.token);
          router.push("/userdashboard");
          toast({
            title: "Login Successful",
            status: "success",
            duration: 6000,
            isClosable: true,
          });
        } else {
          const errorData = await response.json();
          console.error(errorData.error); // Log the error message
          setSubmitError(errorData.error);
          // Handle error (e.g., show error message to the user)
        }
      } catch (error) {
        console.error("An error occurred while processing the request:", error);
        // Handle unexpected errors
      }
    }

    setLogging(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={6} w={"full"} maxW={"md"}>
          <FormControl id="email" isRequired isInvalid={!!errors.email}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl id="password" isRequired isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
          <Stack spacing={6}>
            {/* <Stack
              direction={{ base: 'column', sm: 'row' }}
              align={'start'}
              justify={'space-between'}>
              <Checkbox>Remember me</Checkbox>
              <Text color={'blue.500'}>Forgot password?</Text>
            </Stack> */}
            <Button
              colorScheme={"blue"}
              variant={"solid"}
              onClick={handleLogin}
              disabled={logging}
            >
              {logging ? (
                <>
                  <Spinner size="sm" mr="2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
            {submitError && (
              <Text color="red.500" fontSize="sm">
                {submitError}
              </Text>
            )}
            <Link href="/auth/signup">
              <Text color={"blue.500"}>Create New Account?</Text>
            </Link>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={"Login Image"}
          objectFit={"cover"}
          src={
            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
          }
        />
      </Flex>
    </Stack>
  );
}
