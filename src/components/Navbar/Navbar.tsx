import { Flex, Image } from '@chakra-ui/react';
import React from 'react';
import RightContent from './RightContent/RightContent';
import SearchInput from './SearchInput';
import AuthModal from '../Modal/Auth/AuthModal'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp';
import Directory from './Directory/Directory';

const Navbar: React.FC = () => {
    const [user, loading, error] = useAuthState(auth)
    return (
        <Flex bg="white" height="44px" padding="6px 12px" justify={{md: 'space-between'}}>
            <Flex align="center" width={{base: '40px', md: "auto"}} mr={{base: 0, md: 2}}>
                <Image src="/images/redditFace.svg" height="30px" alt="redditFace" />
                <Image src="/images/redditText.svg" height="46px" alt="redditText" display={{ base: "none", md: "unset" }} />
            </Flex>
            {user && <Directory/>}
            <SearchInput user={user}/>
            <RightContent user={user}/>
            <AuthModal/>
        </Flex>
    )
}
export default Navbar;