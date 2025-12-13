import { benefits } from "../constants";
import Heading from "./Heading";
import Section from "./Section";
import Arrow from "../assets/svg/Arrow";
import { GradientLight } from "./design/Benefits";
import ClipPath from "../assets/svg/ClipPath";

const Benefits = () => {
  return (
    <Section id="features" className="bg-n-11">
      <div className="container relative z-2">
        <Heading
          className="md:max-w-md lg:max-w-2xl"
          title="Why Choose Xacos CLI?"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {benefits.map((item, index) => (
            <div
              key={item.id}
              className="group relative p-6 bg-white border border-n-6 rounded-2xl hover:border-color-1 transition-all duration-300 hover:shadow-xl hover:shadow-color-1/20 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-color-1/10 to-color-2/10 rounded-xl flex items-center justify-center border border-color-1/20">
                  <img
                    src={item.iconUrl}
                    width={24}
                    height={24}
                    alt={item.title}
                    className="opacity-90"
                  />
                </div>
                <div className="flex-1">
                  <h5 className="h5 mb-2 text-n-2 group-hover:text-color-1 transition-colors">
                    {item.title}
                  </h5>
                </div>
              </div>
              <p className="body-2 text-n-4 leading-relaxed">{item.text}</p>
              <div className="mt-4 flex items-center text-color-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-code text-xs font-bold uppercase tracking-wider">
                  Learn more
                </span>
                <Arrow />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Benefits;
