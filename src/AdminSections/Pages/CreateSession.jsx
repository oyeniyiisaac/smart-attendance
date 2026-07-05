import React from 'react'

const CreateSession = () => {
    return (
        <>
            <div>
                <div className='block justify-center items-center h[100vh]'>
                    <h1 className='text-[24px] font-bold'>Create New Session</h1>
                    <p>Configure the parameters for the upcoming lecture session to enable smart attendance tracking.</p>
                </div>
                <div className='w-[400px] border-2 flex flex-col gap-4 justify-center'>
                    <div className='bg-[#dfe3e1]'>
                        <h1>Basic Information</h1>
                    </div>
                    <div className='flex flex-col gap-4 p-4'>
                        <div>
                            <label htmlFor="sessionName">Course Selection</label>
                            <select id="sessionName" name="sessionName" className='w-full border-2 rounded-sm p-2'>
                                <option value="course1">Course 1</option>
                                <option value="course2">Course 2</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateSession
