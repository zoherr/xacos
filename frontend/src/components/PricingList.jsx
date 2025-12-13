import { check } from "../assets";
import { pricing } from "../constants";
import Button from "./Button";

const PricingList = () => {
  return (
    <div className="flex gap-[1rem] max-lg:flex-wrap">
      {pricing.map((item) => (
        <div
          key={item.id}
          className="w-[19rem] max-lg:w-full h-full px-6 bg-white border border-n-6 rounded-[2rem] lg:w-auto even:py-14 odd:py-8 odd:my-4 [&>h4]:first:text-color-1 [&>h4]:even:text-color-1 [&>h4]:last:text-color-1 hover:border-color-1 hover:shadow-xl hover:shadow-color-1/20 transition-all duration-300"
        >
          <h4 className="h4 mb-4">{item.title}</h4>

          <p className="body-2 min-h-[4rem] mb-3 text-n-1/50">
            {item.description}
          </p>

          <div className="flex items-center justify-center h-[5.5rem] mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-color-1 mb-2">Open Source</div>
              <div className="text-sm text-n-4">MIT License</div>
            </div>
          </div>

          <Button
            className="w-full mb-6"
            href="https://www.npmjs.com/package/xacos"
            white
            target="_blank"
            rel="noopener noreferrer"
          >
            Install Now
          </Button>

          <ul>
            {item.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start py-5 border-t border-n-6"
              >
                <img src={check} width={24} height={24} alt="Check" />
                <p className="body-2 ml-4">{feature}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PricingList;
