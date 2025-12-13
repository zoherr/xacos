import React from "react";
import Section from "./Section";
import { socials } from "../constants";

const Footer = () => {
  return (
    <Section crosses={false} className="!px-0 !py-10 bg-n-11 border-t border-n-6">
      <div className="container flex sm:justify-between justify-center items-center gap-10 max-sm:flex-col relative z-10">
        <p className="caption text-n-4 lg:block">
          © {new Date().getFullYear()} Xacos CLI. MIT License. Built with ❤️ for the Node.js community.
        </p>

        <ul className="flex gap-5 flex-wrap">
          {socials.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-white border border-n-6 rounded-full transition-all hover:bg-n-7 hover:scale-110"
            >
              <img src={item.iconUrl} width={16} height={16} alt={item.title} />
            </a>
          ))}
        </ul>
      </div>
    </Section>
  );
};

export default Footer;
