"use client";

import { getDirectories, getCSVFileFromDirectory, getCharts } from "./s3list";
import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import {
  Select,
  Box,
  Center,
  FormControl,
  FormLabel,
  Flex,
  Spinner,
  useToast,
  Text,
  Button
} from "@chakra-ui/react";
import Info from "./info";
import jwt from "jsonwebtoken";

const UserDashboard = () => {
  const [directories, setDirectories] = useState([]);
  const [charts, setCharts] = useState([]);
  const [selectedDirectory, setSelectedDirectory] = useState("");
  const [selectedChart, setSelectedChart] = useState("");
  const [chartInstances, setChartInstances] = useState([]);
  const [loading, setLoading] = useState(true); // State for loader
  const toast = useToast(); // Toast hook
  const [username, setUsername] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem("token");

        const decodedToken = jwt.decode(token);
        if (decodedToken) {
          setUsername(decodedToken.username);
        }
  }, []);

  useEffect(() => {
    const fetchDirectories = async () => {
      try {
        const response = await getDirectories(selectedChart, username);
        setDirectories(response);
      } catch (error) {
        console.error("Error fetching directories:", error);
      }
    };

    const fetchCharts = async () => {
      try {
        const response = await getCharts(username);
        setCharts(response);
      } catch (error) {
        console.error("Error fetching charts:", error);
      }
    };

    fetchDirectories();
    fetchCharts();
    setLoading(false);
  }, [selectedChart, username]);

  useEffect(() => {
    if (selectedDirectory && selectedChart) {
      fetchCSVFromS3(selectedDirectory, selectedChart, username);
    }
  }, [selectedDirectory, selectedChart, username]);

  const fetchCSVFromS3 = async (directory, chart) => {
    try {
      const csvFile = await getCSVFileFromDirectory(directory, chart, username);
      const response = await fetch(
        `https://trendspectrum.s3.us-west-1.amazonaws.com/${username.replace(/\s/g, "+")}/${selectedChart.replace(
          /\s/g,
          "+"
        )}/${directory.replace(/\s/g, "+")}/${csvFile}`
      );
      // Assuming you have an API route to fetch CSVs in a directory
      const csvData = await response.text();
      const rows = csvData.split("\n");
      const labels = [];
      const values = [];

      // Extracting data from CSV
      rows.forEach((row) => {
        const [label, value] = row.split(",");
        labels.push(label);
        values.push(parseFloat(value));
      });

      createChart(labels, values, "myChart");
    } catch (error) {
      console.error("Error fetching CSV:", error);
    }
  };

  const createChart = (labels, values, chartInstanceId) => {
    const existingChartIndex = chartInstances.findIndex(
      (instance) => instance.chartInstanceId === chartInstanceId
    );
    if (existingChartIndex !== -1) {
      chartInstances[existingChartIndex].instance.destroy();
      setChartInstances((prevInstances) =>
        prevInstances.filter((_, index) => index !== existingChartIndex)
      );
    }

    const chartType = determineChartType(selectedChart);
    const ctx = document.getElementById(chartInstanceId);

    let borderColor;
    if (chartType === "line") {
      // Generate a random color for the line
      borderColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`;
    }

    const newChartInstance = new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: selectedDirectory,
            data: values,
            fill: false,
            borderColor: borderColor,
            backgroundColor:
              chartType === "bar"
                ? values.map(() => {
                    // Generate random colors for each bar in bar chart
                    return `rgb(${Math.floor(
                      Math.random() * 256
                    )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
                      Math.random() * 256
                    )})`;
                  })
                : undefined,
            tension: 0.1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false, // Allow the chart to adjust its size dynamically
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    setChartInstances((prevInstances) => [
      ...prevInstances,
      { chartInstanceId, instance: newChartInstance },
    ]);
  };

  const handleDirectoryChange = (event) => {
    const selected = event.target.value;
    setSelectedDirectory(selected);
  };

  const determineChartType = (selectedOption) => {
    // Check the selected option and return the corresponding chart type
    switch (selectedOption) {
      case "Line Chart":
        return "line";
      case "Bar Chart":
        return "bar";
      default:
        return null; // Return null for unsupported chart types or default option
    }
  };

  const handleChartChange = (event) => {
    const selected = event.target.value;
    setSelectedChart(selected);
  };

  const handleClear = () => {
    setSelectedDirectory("");
    setSelectedChart("");
    setChartInstances([]);
    setDirectories([]);
    setCharts([]);
    setLoading(true);
  }

  return (
    <>
      {loading ? (
        <Center height="100vh">
          <Flex align="center">
            <Spinner size="xl" mr="2" />
            <Text>Loading Data....</Text>
          </Flex>
        </Center>
      ) : (
        <>
          {charts?.length>0 ? (
            <Box>
              <Flex mt={4}>
                <FormControl flex="1" mr={4} ml={4}>
                  <FormLabel>Visualization</FormLabel>
                  <Select onChange={handleChartChange}>
                    <option value="">Select a Visualization</option>
                    {charts?.map((chart) => (
                      <option key={chart} value={chart}>
                        {chart}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl flex="1" mr={4}>
                  <FormLabel>Data</FormLabel>
                  <Select onChange={handleDirectoryChange}>
                    <option value="">Select Data</option>
                    {directories?.map((directory) => (
                      <option key={directory} value={directory}>
                        {directory}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <Button onClick={handleClear} mt={7} mr={4}>Clear</Button>
              </Flex>
              <Center
                style={{ height: "90vh", overflow: "hidden" }}
                marginTop={5}
              >
                <canvas
                  id="myChart"
                  style={{ maxWidth: "80vw", maxHeight: "100%", width: "auto" }}
                ></canvas>
              </Center>
            </Box>
          ) : (
            <Info />
          )}
        </>
      )}
    </>
  );
};

export default UserDashboard;
