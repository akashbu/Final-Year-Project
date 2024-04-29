'use client'

import { Avatar, Box, Stack, Text, useColorModeValue } from '@chakra-ui/react'

export default function Work() {
  return (
    <Stack
      bg={useColorModeValue('gray.50', 'gray.800')}
      py={16}
      px={8}
      spacing={{ base: 8, md: 10 }}
      align={'center'}
      direction={'column'} id="aim"
      style={{
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text fontSize={{ base: 'xl', md: '2xl' }} textAlign={'center'} maxW={'3xl'}>
      The aim of Trendspectrum is to empower businesses and organizations with actionable insights derived from data. 
      Through advanced analytics, data processing, and visualization solutions, we strive to facilitate informed decision-making and drive meaningful outcomes for our clients.
      </Text>
      <Box textAlign={'center'}>
        <Avatar
          name="A"
          mb={2}
        />

        <Text fontWeight={600}>Akash Butala</Text>
        <Text fontSize={'sm'} color={useColorModeValue('gray.400', 'gray.400')}>
          CEO
        </Text>
      </Box>
    </Stack>
  )
}