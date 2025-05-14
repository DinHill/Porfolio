"use client";
import {motion} from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import Stats from '@/components/Stats';
import Testimonial from '@/components/Testimonial';
import Info from '@/components/Info';
import Journey from '@/components/Journey';
import Knowledge from '@/components/Knowledge';
import Blob from '@/components/Blob';
import Socials from '@/components/Socials';


const About = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
      }}
      className="h-screen flex items-center"
    >
    <div className="container mx-auto px-0">
      <div className="flex flex-col xl:flex-row items-center gap-24 w-full h-[680px]">
        {/* img and social icons */}
        <div className="hidden xl:flex flex-col w-full h-full pt-14 max-w-[500px] relative">
          <Image 
          src="/assets/avatar.png" 
          width={320} 
          height={496} 
          alt=""
          className="z-20 relative"
          />
          <div className="w-full h-[60px] absolute left-0 top-[500px] right-0 bg-gradient-to-t from-primary via-primary/90 z-30"></div>
          <div className="absolute top-[80px] -left-[80px] z-10"> 
            <Blob containerStyles="w-[420px] h-[420px]"/>
          </div>

          <Socials containerStyles="flex gap-12 z-40 w-max tranform translate-x-[30px]" iconStyles="w-[48px] h-[48px] text-[22px] text-accent hover:text-accent-hover transition-all flex items-center justify-center rounded-full cursor-pointer"/>
        </div>
        {/* scroll area */}
        <ScrollArea className="w-full h-[680px]">
          <div>
            <div className=" flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <p>About me</p>
            </div>
            <h2 className="h2 mb-6">
              <span className="text-accent">Dinh Hieu</span> Nguyen
            </h2>
            <p className="max-w-[540px] mb-12">Hi, I'm Hieu — a Computer Science student with a big curiosity for how software works and how to build cool things with code. I enjoy learning new technologies, solving problems, and turning small ideas into real, working apps.
            </p>

            <div className="flex flex-col items-start gap-16">
              <Stats/>
              <Testimonial/>
              <Info/>
              <Journey/>
              <Knowledge/>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>

  </motion.section>
  );
}  

export default About;