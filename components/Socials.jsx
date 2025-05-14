import {BiLogoFacebook, BiLogoInstagram, BiLogoLinkedin} from 'react-icons/bi';

const socials = [
    {
        icon: <BiLogoFacebook/>,
        path: "https://www.facebook.com/ItsnotHiu",
    },
    {
        icon: <BiLogoInstagram/>,
        path: "https://www.instagram.com/hill_neeee/",
    },
    {
        icon: <BiLogoLinkedin/>,
        path: "https://www.linkedin.com/in/dinh-hieu-nguy%E1%BB%85n-267383363/",
    },
]

const Socials = ({ containerStyles, iconStyles }) => {
    return (
        <div className={containerStyles}>
            {socials.map((item, index) => {
                return (
                    <a
                        key={index}
                        href={item.path}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={iconStyles}
                    >
                        {item.icon}
                    </a>
                );
            })}
        </div>
    );
};

export default Socials;