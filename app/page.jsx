"use client";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { MdArrowOutward } from 'react-icons/md';
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';

import Blob from "@/components/Blob";
import Image from "next/image";
import avatarImg from "@/public/assets/avatar.png";
import Socials from "@/components/Socials";
import Pattern from "@/components/Pattern";


const Home = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
      }}
      className="h-screen flex items-center"
    >
    <Pattern />
    <div className="flex flex-col xl:flex-row items-center justify-between w-full">
      <div className="w-full xl:w-[550px] flex flex-col items-center xl:items-start text-center xl:text-left">
        <h1 className="h1 flex-1 mb-[28px]">
          Hi! I'm Dinh Hieu,<br />
          <div className="h-[50px]">
            <TypeAnimation 
              sequence={[
                "IT Student", 2000, 
                "Game Dev Intern", 2000,
              ]}
              wrapper="span" 
              speed={40} 
              className="text-accent" 
              repeat={Infinity} 
              cursor={false}
            />
          </div>
        </h1>
        <p className="max-w[500px] mb-[44px]">
          I'm a Computer Science student with a strong interest in software development and technology. 
          I'm always excited to explore new tools, build cool projects, and grow through real-world experiences. 
          I'm currently looking for opportunities to learn, contribute, and be part of a passionate tech team.
        </p>
        <button className="btn btn-lg btn-accent mb-16">  
          <div className="flex items-center gap-3"> 
            <span>Let's talk</span>
            <MdArrowOutward className="text-xl" />
          </div>
        </button>

        <div className="flex flex-col xl:flex-row xl:items-center gap-4 xl:gap-8 mb-12 xl:mb-0">
          <div className="flex items-center gap-4 text-lg"> 
            <span className="text-accent">
              <HiOutlinePhone className="text-xl"/>
            </span>
            <span>+84 905979036</span>
          </div>

          <div className="flex items-center gap-4 text-lg"> 
            <span className="text-accent">
              <HiOutlineMail className="text-xl"/>
            </span>
            <span>hieunguyendinh2004@gmail.com</span>
          </div>
        </div>
        <Socials containerStyles="flex 2xl:flex-col gap-6 xl:hidden 2xl:flex 2xl:absolute 2xl:top-1/2 2xl:right-2 2xl:transform 2xl:-translate-x-1/2 2xl:-translate-y-1/2" iconStyles="bg-accent text-white hover:bg-accent-hover transition w-[48px] h-[48px] text-[22px] flex items-center justify-center rounded-full cursor-pointer"
        />
      </div>
      <div className="hidden xl:block flex-1 relative z-20">
        {/*blob */}
        <Blob containerStyles="w-[560px] h-[560px]" />
        {/* ava */}
        <Image 
        src= {avatarImg} 
        alt ="" 
        width={440}
        height={600}
        quality={100}
        className="absolute -top-20 left-[100px]"
        />
        <div className="w-full h-[100px] absolute left-0 top-[500px] right-0 bg-gradient-to-t from-primary via-primary/90 z-30"></div>
      </div>
    </div>
  </motion.section>
  );
};

export default Home;