import React from 'react';
import HeroSection from './HeroSection';

const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[80vh] bg-[#1c1917] text-stone-50 p-8">
            <HeroSection />
        </div>
    );
};

export default HomePage;
