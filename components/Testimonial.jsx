"use client";
import {Swiper, SwiperSlide} from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import {ImQuotesLeft} from 'react-icons/im';

const testimonials = [
    {
        message:"Stay hungry, stay foolish.",
        name:"Steve Jobs",
    },
    {
        message:"First, solve the problem. Then, write the code.",
        name:"John Johnson ",
    },
    {
        message:"Code is like humor. When you have to explain it, it’s bad.",
        name:"Cory House",
    },
]

const Testimonial = () => {
    return (
        <Swiper 
        modules={{Autoplay}}
        loop={false}
        autoplay={{delay:4000, disableOnInteraction: false}}
        className="w-full max-w[310px] md:max-w-[520px] bg-secondary rounded-lg"
        >
            {testimonials.map((person, index) => {
                return ( 
                    <SwiperSlide key={index}>
                        <div className="flex px-8 py-6 gap-8">
                            <ImQuotesLeft className="hidden xl:flex text-8xl text-accent w-[50px] h-[50px] flex-shrink-0"/>
                            <div className="flex flex-col gap-2">
                                <p>{person.message}</p>
                                <p className="absolute bottom-4 right-4 text-accent font-semibold">
                                    {person.name}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                    );
                })}
        </Swiper>
    );   
};

export default Testimonial;