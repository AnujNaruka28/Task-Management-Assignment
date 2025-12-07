import React from 'react';

const ButtonHoverTopSlowFlip = ({ initialText = "Log In", hoverText = "Dashboard", onClick }) => {
    return (
        <button
            onClick={onClick}
            className='group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full border border-stone-700 bg-stone-900 font-medium cursor-pointer'
        >
            <div className='inline-flex h-10 translate-y-0 items-center justify-center px-6 text-stone-50 transition duration-500 group-hover:-translate-y-[150%]'>
                {initialText}
            </div>
            <div className='absolute inline-flex h-10 w-full translate-y-full items-center justify-center text-stone-900 transition duration-500 group-hover:translate-y-0'>
                <span className='absolute h-full w-full translate-y-full skew-y-12 scale-y-0 bg-stone-50 transition duration-500 group-hover:translate-y-0 group-hover:scale-150'></span>
                <span className='z-10 font-semibold'>{hoverText}</span>
            </div>
        </button>
    );
};

export default ButtonHoverTopSlowFlip;
