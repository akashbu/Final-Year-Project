'use client'
import Link from "next/link";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useToast 
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import dynamic from 'next/dynamic' 
import { useRouter } from 'next/navigation';


const Links = [
  { name: 'Dashboard', href: '/userdashboard' },
  { name: 'Upload', href: '/userdashboard/upload' },
];

const NavLink = (props) => {
  const { children, href } = props

  return (
    <Link href={href}>
      <Box
        as="a"
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
          textDecoration: 'none',
          bg: useColorModeValue('gray.200', 'gray.700'),
        }}>
        {children}
      </Box>
    </Link>
  )
}

const UserNavbar= ({username}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter();
  const toast = useToast(); 

  const handleLogout = () => {
    // Clear token from local storage
    localStorage.removeItem('token');
    // Redirect to home page
    router.push('/');
    setTimeout(() => {
      toast({
        title: "Logout Successful",
        status: "success",
        duration: 6000,
        isClosable: true,
      });
    }, 1500);
  };

  const avatarInitials = username ? `${username.charAt(0).toUpperCase()}` : '';

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Link href="/">
              <Box>TrendSpectrum</Box>
            </Link>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link.name} href={link.href}>
                  {link.name}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
          {username && (
              <Box mr={4} fontSize="sm" fontWeight="bold">
                {username}
              </Box>
            )}
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  name={avatarInitials}
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.name} href={link.href}>
                  {link.name}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}

export default dynamic(() => Promise.resolve(UserNavbar), { ssr: false });

