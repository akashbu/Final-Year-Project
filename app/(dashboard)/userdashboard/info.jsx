'use client'

import { Box, Heading, Text } from '@chakra-ui/react'
import { InfoIcon } from '@chakra-ui/icons'

export default function Info() {
  return (
    <Box 
      display="flex"
      flexDirection="column"
      minHeight="80vh" // Set minimum height to viewport height
      justifyContent="space-between" // Push content to top and footer to bottom
      textAlign="center" 
      py={10} 
      px={6}
    >
      <Box>
        <InfoIcon boxSize={'50px'} color={'blue.500'} />
        <Heading as="h2" size="xl" mt={6} mb={2}>
          Results Not Generated
        </Heading>
        <Text color={'gray.500'}>
          Currently there is no data to visualize. Results will be out soon. 
          If data hasn&apos;t been uploaded yet, simply upload it, then sit back and relax.
        </Text>
      </Box>
    </Box>
  )
}
