'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  Spinner,
  Image,
  useToast 
} from '@chakra-ui/react'
import { useState } from 'react'

export default function Auth() {
  const router = useRouter();
  const [signing, setSigning] = useState(false);
  const [submitError, setSubmitError] = useState("")
  const toast = useToast(); 

  const [formData, setFormData] = useState({
    first_name:"",
    last_name:"",
    email:"",
    password:""
  })

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  });

  const handleSignUp = async () => {
    setSigning(true)

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
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // User Sign Up Successful
        router.push('/auth/login')
        toast({
          title: "Sign Up Successful",
          status: "success",
          duration: 6000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        console.error(errorData.error); // Log the error message
        setSubmitError(errorData.error)
        // Handle error (e.g., show error message to the user)
      }
    } catch (error) {
      console.error('An error occurred while processing the request:', error);
      // Handle unexpected errors
    }
  }

  setSigning(false)
  };
  

  const dataBinding = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value })
    setErrors({...errors, [e.target.name]: ""});
  }
 

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'md'}>
          <Flex justify="space-between">
            <FormControl id="first_name" mr={2} flex={1} isRequired isInvalid={!!errors.first_name}>
              <FormLabel>First Name</FormLabel>
              <Input type="text" name="first_name" value={formData.first_name} onChange={dataBinding}/>
              <FormErrorMessage>{errors.first_name}</FormErrorMessage>
            </FormControl>
            <FormControl id="last_name" ml={2} flex={1} isRequired isInvalid={!!errors.last_name}>
              <FormLabel>Last Name</FormLabel>
              <Input type="text" name="last_name" value={formData.last_name} onChange={dataBinding}/>
              <FormErrorMessage>{errors.last_name}</FormErrorMessage>
            </FormControl>
          </Flex>
          <FormControl id="email" isRequired isInvalid={!!errors.email}>
            <FormLabel>Email address</FormLabel>
            <Input type="email" name="email" value={formData.email} onChange={dataBinding}/>
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl id="password" isRequired isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input type="password" name="password" value={formData.password} onChange={dataBinding}/>
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
          <Stack spacing={6}>
            <Button colorScheme={'blue'} variant={'solid'} onClick={handleSignUp} disabled={signing}>
            {signing ? (
                <>
                  <Spinner size="sm" mr="2" />
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            {submitError && (
              <Text color="red.500" fontSize="sm">
                {submitError}
              </Text>
            )}
            <Link href="/auth/login">
              <Text color={'blue.500'}>Already have an account?</Text>
            </Link>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Login Image'}
          objectFit={'cover'}
          src={
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
          }
        />
      </Flex>
    </Stack>
  );
}
