'use client';
import React from 'react';
import Image from 'next/image';
import heroImage from '@/assets/images/taskmanagement_brew.png';
import { motion } from 'motion/react';
import { TypingAnimation } from "@/components/ui/typing-animation";
import { TextAnimate } from "@/components/ui/text-animate";

const HeroSection = () => {
    return (
        <section className="flex flex-col md:flex-row w-full items-center justify-between gap-12 py-12 md:py-24 overflow-hidden">
            {/* Left Image - Comes from Left */}
            <motion.div
                className="flex-1 flex justify-center md:justify-start w-full"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="relative w-full max-w-lg aspect-square md:aspect-[4/3]">
                    <Image
                        src={heroImage}
                        alt="Task Management Preview"
                        fill
                        className="object-cover rounded-2xl border border-stone-700/50 shadow-xl shadow-stone-700/20 transition-all duration-500"
                        priority
                    />
                    {/* Decorative background blob/circle */}
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-stone-600/30 rounded-full blur-3xl opacity-40" />
                </div>
            </motion.div>

            {/* Right Content - Comes from Right */}
            {/* Right Content */}
            <div className="flex-1 flex flex-col items-start space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-[1.1]">
                        Simplify Your <br className="md:hidden" />
                        <TypingAnimation
                            className="text-stone-400"
                            words={["Task Creation", "Task Tracking", "Task Updates", "Task Completion"]}
                            loop={true}
                        />
                    </h1>
                </motion.div>
                <TextAnimate delay={1} animation="fadeIn" by="line" as="p" className="text-xl text-stone-400 max-w-lg leading-relaxed">
                    {`Experience a new way to organize your life. Clean, efficient, and designed for focus. Our platform helps you prioritize what matters most, cutting through the noise of daily chaos.`}
                </TextAnimate>
                <TextAnimate delay={1.5} animation="fadeIn" by="line" as="p" className="text-lg text-stone-500 max-w-lg leading-relaxed">
                    {`Join thousands of users who have transformed their productivity. With intuitive tools and a distraction-free interface, achieving your goals has never been easier or more satisfying.`}
                </TextAnimate>
            </div>
        </section>
    );
};

export default HeroSection;
