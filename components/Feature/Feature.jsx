"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";

import { FiPieChart, FiDatabase, FiBarChart2 } from "react-icons/fi";

const Card = ({ heading, description, icon, href }) => {
  return (
    <Box
      maxW={{ base: "full", md: "275px" }}
      w={"full"}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={5}
    >
      <Stack align={"start"} spacing={2}>
        <Flex
          w={16}
          h={16}
          align={"center"}
          justify={"center"}
          color={"white"}
          rounded={"full"}
          bg={useColorModeValue("gray.100", "gray.700")}
        >
          {icon}
        </Flex>
        <Box mt={4}>
          <Heading size="md">{heading}</Heading>
          <Text mt={5} fontSize={"sm"}>
            {description}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};

export default function Feature() {
  return (
    <div id="services" style={{ height: "100vh"}}>
      <Center h="100vh">
      <Box p={4}>
        <Stack spacing={4} as={Container} maxW={"3xl"} textAlign={"center"}>
          <Heading fontSize={{ base: "2xl", sm: "4xl" }} fontWeight={"bold"}>
            Our Services
          </Heading>
          <Text color={"gray.600"} fontSize={{ base: "sm", sm: "lg" }}>
          Trendspectrum provides insights by uncovering valuable data trends, processes and analyzes data with cutting-edge tools for accuracy, and offers visualization solutions to effectively communicate insights and drive actionable outcomes.
          </Text>
        </Stack>

        <Container maxW={"5xl"} mt={12}>
          <Flex flexWrap="wrap" gridGap={6} justify="center">
            <Card
              heading={"Insights Generation"}
              icon={<Icon as={FiPieChart} w={10} h={10} />}
              description={
                "Unlock the power of data with Trendspectrum's Insights Generation service. We delve deep into your data to extract valuable trends, patterns, and correlations."
              }
            />
            <Card
              heading={"Data Processing and Analysis"}
              icon={<Icon as={FiDatabase} w={10} h={10} />}
              description={
                "At Trendspectrum, we transform raw data into actionable insights. Our advanced tools and methodologies clean, organize, and analyze complex datasets, ensuring accurate and reliable results."
              }
            />
            <Card
              heading={"Visualization Solutions"}
              icon={<Icon as={FiBarChart2} w={10} h={10} />}
              description={
                "Trendspectrum's Visualization Solutions create captivating visual representations of your data for clear understanding and actionable insights. From interactive dashboards to compelling infographics, we empower effective communication and drive meaningful outcomes."
              }
            />
          </Flex>
        </Container>
      </Box>
      </Center>
    </div>
  );
}
