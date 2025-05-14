import {
    RiReactjsFill,
    RiNextjsFill,
    RiHtml5Fill,
    RiCss3Fill,
    RiTailwindCssFill,
    RiNodejsFill,
} from 'react-icons/ri';
import {
    SiPython,
    SiC,
    SiCplusplus, 
    SiMysql,
    SiMongodb,
} from 'react-icons/si';

import {
    DiJava,
} from 'react-icons/di';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from '@/components/ui/tooltip';

const knowledge = [
    {
        icon: <RiReactjsFill />,
        name: 'React.js',
    },
    {
        icon: <RiNextjsFill />,
        name: 'Next.js',
    },
    {
        icon: <RiHtml5Fill />,
        name: 'HTML5',
    },
    {
        icon: <RiCss3Fill />,
        name: 'CSS3',
    },
    {
        icon: <RiTailwindCssFill />,
        name: 'Tailwind CSS',
    },
    {
        icon: <RiNodejsFill />,
        name: 'Node.js',
    },
    {
        icon: <DiJava />,
        name: 'Java',
    },
    {
        icon: <SiPython />,
        name: 'Python',
    },
    {
        icon: <SiC />,
        name: 'C',
    },
    {
        icon: <SiCplusplus />,
        name: 'C++',
    },
    {
        icon: <SiMysql />,
        name: 'MySQL',
    },
    {
        icon: <SiMongodb />,
        name: 'MongoDB',
    },
]

const Knowledge = () => {
    return (
        <div>
            <h2 className="h2 mb-8">
                My <span className="text-accent">Knowledge</span>
            </h2>
            <div className="flex flex-wrap gap-6 max-w-sm xl:max-w-none">
                {knowledge.map((item, index) => {
                    return(
                        <TooltipProvider key={index}>
                            <Tooltip>
                                <TooltipTrigger className="w-16 h-1/6 rounded-full flex items-center justify-center bg-tertiary/70 group">
                                    <div className="text-3xl group-hover:text-accent transition-all duration-300">{item.icon}</div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-lg">{item.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    );
                })}
            </div>
        </div>
    );
};

export default Knowledge;