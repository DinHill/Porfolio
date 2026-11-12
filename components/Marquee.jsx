import { marquee } from "@/data/portfolio";
import { PxIcon } from "./Pixel";

const Marquee = () => {
  // Rendered twice so the loop scrolls seamlessly
  const items = [...marquee, ...marquee];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((item, i) => (
          <span key={i}>
            {item}
            <PxIcon name="star" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
