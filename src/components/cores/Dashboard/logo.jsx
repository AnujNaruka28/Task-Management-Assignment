import logo from '@/assets/images/task-logo.svg'
import Image from 'next/image'

export const Logo = () => {
    return (
        <Image src={logo} width={50} height={50}/>
    )
}
