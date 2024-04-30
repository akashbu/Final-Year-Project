"use client";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  useToast,
  Center,
  HStack,
  Progress,
  IconButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { AiOutlinePaperClip, AiOutlineClose } from "react-icons/ai";
import { getSignedURL } from "./actions";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

export default function UploadFile() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [user, setUser] = useState(null);
  const toast = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const decodedToken = jwt.decode(token);
    if (decodedToken) {
      setUser(decodedToken.username);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      // If no file is selected, show error message
      toast({
        title: "Please select a file",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setStatusMessage("creating");
    setLoading(true);
    // Do all the image upload and everything

    if (file) {
      setStatusMessage("uploading file");
      const signedURLResult = await getSignedURL(user, file.name);

      if (signedURLResult.failure !== undefined) {
        setStatusMessage("failed");
        setLoading(false);
        console.error(signedURLResult.failure);
        return;
      }

      const { url } = signedURLResult.success;

      const request = new XMLHttpRequest();
      setRequest(request);
      request.open("PUT", url, true);
      request.setRequestHeader("Content-Type", file.type);

      request.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          setStatusMessage("uploaded");
          setLoading(false);
          setPreviewUrl(null);
          setFile(null);
          setUploadProgress(0);
          toast({
            title: "File uploaded successfully",
            status: "success",
            duration: 8000,
            isClosable: true,
          });
          router.push("/userdashboard");
          setStatusMessage("");
        } else {
          setStatusMessage("failed");
          setLoading(false);
          console.error(request.statusText);
        }
      };

      request.onerror = () => {
        setStatusMessage("failed");
        setLoading(false);
        console.error(request.statusText);
      };

      request.send(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setPreviewUrl(null);
    setFile(null);
    toast({
      title: "File removed successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCancelUpload = () => {
    if (request) {
      request.abort();
      setStatusMessage("canceled");
      setLoading(false);
      setPreviewUrl(null);
      setFile(null);
      setUploadProgress(0);
      toast({
        title: "Upload canceled",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Center h="80vh">
      <VStack
        width="sm"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        p="6"
      >
        <form onSubmit={handleSubmit}>
          {statusMessage && (
            <Text
              bg="yellow.100"
              border="1px solid"
              borderColor="yellow.400"
              color="yellow.700"
              p="3"
              mb="4"
              borderRadius="md"
              position="relative"
            >
              {statusMessage}
            </Text>
          )}

          <VStack align="flex-start" spacing="4" pb="4" w="full">
            <VStack align="flex-start" spacing="1" w="full">
              <FormControl>
                <FormLabel fontSize="lg">
                  Share your CSV data here..!!
                </FormLabel>
              </FormControl>
            </VStack>

            {previewUrl && file && (
              <div className="mt-4">
                {file.type.startsWith("image/") ? (
                  <img src={previewUrl} alt="Selected file" />
                ) : file.type.startsWith("video/") ? (
                  <video src={previewUrl} controls />
                ) : file.type === "text/csv" ? (
                  <div>
                    <p>Selected CSV File: {file.name}</p>
                  </div>
                ) : null}
                <Button
                  onClick={handleRemoveFile}
                  colorScheme="red"
                  size="sm"
                  mt="2"
                >
                  Remove
                </Button>
              </div>
            )}

            <FormControl>
              <FormLabel>
                <Button
                  as="label"
                  htmlFor="media"
                  variant="outline"
                  cursor="pointer"
                  size="lg"
                  leftIcon={<AiOutlinePaperClip />}
                >
                  Attach File
                </Button>
                <Input
                  id="media"
                  name="media"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,text/csv"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </FormLabel>
            </FormControl>
            {uploadProgress > 0 && (
              <Progress
                hasStripe
                value={uploadProgress}
                colorScheme="blue"
                size="sm"
                w="100%"
              />
            )}

            {uploadProgress > 0 && (
              <HStack key={uploadProgress} justifyContent="space-between" w="100%">
                <Text ml="2">{uploadProgress}%</Text>
                <IconButton
                  aria-label="Cancel upload"
                  icon={<AiOutlineClose />}
                  onClick={handleCancelUpload}
                  ml="2"
                />
              </HStack>
            )}
          </VStack>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              disabled={loading}
              isLoading={loading}
            >
              Upload
            </Button>
          </div>
        </form>
      </VStack>
    </Center>
  );
}
