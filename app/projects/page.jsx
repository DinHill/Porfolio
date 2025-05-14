"use client";
import { motion } from 'framer-motion';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import Image from 'next/image';  
import { MdArrowOutward } from 'react-icons/md';
import { FaGithub } from 'react-icons/fa';

const projects = [
  {
    id: 1,
    category: "web",
    title: "London Zoo Intranet CMS",
    description: "Internal website prototype for zoo content management: tickets, exhibits, and education.",
    image: "/assets/projects/LondonZoo.png",
    link: "https://uogcloud.sharepoint.com/:u:/r/sites/NguyenDinhHieu-001306203-S-CAM/SitePages/LondonZoo.aspx?csf=1&web=1&e=bQqGeX",
    github:"",
    tech: ["Microsoft Sharepoint"],
  },
  {
    id: 2,
    category: "web",
    title: "Task Manager",
    description: "Task management system with MEVN stack, and CRUD features.",
    image: "/assets/projects/TaskManager.png",
    link: "",
    github:"https://github.com/DinHill/COMP1842/tree/main",
    tech: ["MongoDB", "Express", "Vue.js", "Node.js", "Tailwind CSS"],
  },
  {
    id: 3,
    category: "console app",
    title: "BookStore Console App",
    description: "Java-based console app for managing book sales, applying OOP principles and simple DB integration.",
    image: "/assets/projects/BookStoreProject.png",
    link: "",
    github:"https://github.com/DinHill/BookStoreProject",
    tech: ["Java", "OOP", "MySQL"],
  },
  {
    id: 4,
    category: "desktop app",
    title: "Desktop Information System",
    description: "Desktop app for managing education data with CRUD functions.",
    image: "/assets/projects/DIS.png",
    link: "",
    github:"https://github.com/DinHill/ROYCE",
    tech: ["C#", "OOP", "SQL Server"],
  },
  {
    id: 5,
    category: "uiux",
    title: "Motor Riding Weather App",
    description: "App prototype for real-time weather + direction assistant for motorbike users.",
    image: "/assets/projects/RidingMoto.png",
    link: "https://559a28.axshare.com/?g=4",
    github:"",
    tech: ["Axure RP 11"],
  },
]

const categories = [
  "web",
  "console app",
  "desktop app",
  "uiux",
];


const Projects = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
      }}
      className="min-h-screen flex items-center py-24 xl:py-0"
    >
    <div className="container mx-auto w-full h-full flex flex-col justify-center">
      <h2 className="h2 mb-6 xl:mb-12 max-w-[600px]">
        My Latest <span className= "text-accent">Personal Projects</span>
      </h2>
      <Tabs 
      defaultValue="web" 
      className="w-full flex flex-col gap-6 xl:gap-12">
        <TabsList className="flex flex-wrap justify-center items-center gap-4 h-full mb-4 xl:mb-0">
          {categories.map((category) => {
            return (
              <TabsTrigger 
                key={category} 
                value={category} 
                className="capitalize border border-white/10 data-[state=active]:bg-accent
                data-[state=active]:border-accent h-[48px] px-6 rounded-full cursor-pointer">
                {category === "uiux" ? "UI/UX Desgin" : category}
              </TabsTrigger>
            )
          })}
        </TabsList>
        <div className="h-[400px] scrollbar scrollbar-thumb-accent scrollbar-track-accent/5 overflow-y-scroll xl:overflow-y-visible">
          {categories.map((category) => {
            return (
              <TabsContent key={category} value={category}>
                <Swiper 
                modules={[Pagination]} 
                pagination={{ clickable: true, dynamicBullets: true }}
                spaceBetween={20}
                className="h-max xl:h-[460px]" >
                  {projects
                  .filter((project) => project.category === category)
                  .map((project) => {
                    return (
                      <SwiperSlide ket={project.id} className="h-full">
                        <div className="flex flex-col xl:flex-row gap-8 xl:gap-12">
                          <div className="w-full max-w-[300px] flex flex-col gap-6 xl:gap-8 xl:pt-6 order-2 xl:order-none">
                            <h3 className="h3">{project.title}</h3>
                            <div className="xl:mb-4 max-w-[300px] min-h-[130px]">
                              <p className="mb-4">Technologies Used</p>
                              <ul className="flex flex-wrap gap-4">
                                {project.tech.map((item, index) => {
                                  return (
                                    <li 
                                    key={index} 
                                    className="flex items-center gap-4 bg-[#a883ff]/13 h-[28px] px-[14px] rounded-full">
                                      {item}
                                    </li>
                                  )
                                })}
                              </ul>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 items-start">
             
                              {project.link && (
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-accent flex gap-2"
                                >
                                  <MdArrowOutward className="text-xl" />
                                  <span>Live Project</span>
                                </a>
                              )}
                              {project.github && (
                                <a
                                  href={project.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-white flex gap-2"
                                >
                                  <FaGithub className="text-xl" />
                                  <span>GitHub Repo</span>
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="w-full h-[200px] md:h-[300px] xl:h-[400px] relative bg-pink-50/10 order-1 xl:order-none rounded-lg overflow-hidden">
                            <Image 
                            src={project.image} 
                            alt={project.image} 
                            fill 
                            className= "object-cover"
                            />
                          </div>
                        </div>
                      </SwiperSlide>
                    )
                  })}
                </Swiper>
              </TabsContent>
            );
          })}
        </div>
      </Tabs>
    </div>
  </motion.section>
  );
}

export default Projects;