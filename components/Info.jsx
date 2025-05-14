import { HiOutlineMail, HiOutlinePhone, HiOutlineUser, HiOutlineLocationMarker } from "react-icons/hi";

const Info = () => {
    return (
        <div className="flex flex-col gap-6 md:gap-10">
            <div className="flex flex-col md:flex-row gap-0">
                <div className="w-[280px] flex items-start gap-4">
                    <HiOutlineUser className="text-2xl mt-1 text-accent"/>
                    <div>
                        <p className="text-lg">Date of Birth</p>
                        <p>23 August 2004</p>
                    </div>
                </div>
                <div className="w-[px] flex items-start gap-4">
                    <HiOutlineMail className="text-2xl mt-1 text-accent"/>
                    <div>
                        <p className="text-lg">Email Address</p>
                        <p>hieunguyendinh2004@gmail.com</p>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-0">
                <div className="w-[280px] flex items-start gap-4">
                    <HiOutlinePhone className="text-2xl mt-1 text-accent"/>
                    <div>
                        <p className="text-lg">Phone</p>
                        <p>+84 905979036</p>
                    </div>
                </div>
                <div className="w-[px] flex items-start gap-4">
                    <HiOutlineLocationMarker className="text-2xl mt-1 text-accent"/>
                    <div>
                        <p className="text-lg">Location</p>
                        <p>Da Nang, Viet Nam</p>
                    </div>
                </div>
            </div>
        </div>
    )
    
};

export default Info;