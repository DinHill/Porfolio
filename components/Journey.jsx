const journey =  [
    {
        years: "7/2023 - 10/2023",
        role:"Game Developer Intern",
        institution: "Undisclosed Project | Remote",
    },
    {
        years: "2022 - 2026",
        role:"Student",
        institution: "University of Greenwich",
    },
];

const Journey = () => {
    return (
        <div>
            <h2 className="h2 mb-8 ">
                Education & <span className="text-accent">Experience</span>
            </h2>
            {journey.map((item, index) => {
                const {institution, role, years} = item;
                return (
                    <div key={index} className="flex items-center gap-12 w-full">
                        <div className="flex flex-col w-max justify-center items-center">
                            <div className="w-3 h-3 bg-accent rounded full"></div>
                            <div className="w-[1px] h-[180px] bg-white/10"></div>
                        </div>
                        <div className="max-w-[500px]">
                            <p className="mb-6 text-lg text-white/50">{years}</p>
                            <h4 className="h4 mb-2">{role}</h4>
                            <p className="text-lg text-white/50">{institution}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Journey;