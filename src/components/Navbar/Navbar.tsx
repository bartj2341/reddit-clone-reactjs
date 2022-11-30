import { Flex, Image } from '@chakra-ui/react';
import React from 'react';
import RightContent from './RightContent/RightContent';
import SearchInput from './SearchInput';
import AuthModal from '../Modal/Auth/AuthModal'

const Navbar: React.FC = () => {
    return (
        <Flex bg="white" height="44px" padding="6px 12px">
            <Flex align="center">
                <Image src="/images/redditFace.svg" height="30px" alt="redditFace" />
                <Image src="/images/redditText.svg" height="46px" alt="redditText" display={{ base: "none", md: "unset" }} />
            </Flex>
            {/* <Directory/> */}
            <SearchInput/>
            <RightContent/>
            <AuthModal/>
        </Flex>
    )
}
export default Navbar;