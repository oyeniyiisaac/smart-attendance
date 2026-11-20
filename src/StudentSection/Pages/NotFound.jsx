import React from 'react'
import notFoundImg from '../../assets/404 Error Page not Found with people connecting a plug-bro.png'

const NotFound = () => {
    return (
        <>
            <div className='flex flex-col items-center '>
                <h1 className='text-[30px] text-[#0a643a] font-bold'>Page Not Found</h1>
                <img className='w-[600px]' src={notFoundImg} alt="Not found" />
            </div>
        </>
    )
}

export default NotFound
