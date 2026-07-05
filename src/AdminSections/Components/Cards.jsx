import React from 'react'

const Cards = ({ icon, title, value, bgColor, textColor, valueColor }) => {

    return (
        <>
            <div className="w-[280px] h-[150px] mt-[1rem] border-1 border-gray-300 text-black bg-white rounded-lg  shadow-sm p-4">
                <div className="material-icons-outlined  text-4xl mb-2">
                    <span className={`material-symbols-outlined ${bgColor} ${textColor} rounded-md p-2`}>
                        {icon}
                    </span>
                </div>
                <h2 className="text-lg font-semibold mb-1 text-[#3f4941]">{title}</h2>
                <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
            </div>
        </>
    )
}

export default Cards
