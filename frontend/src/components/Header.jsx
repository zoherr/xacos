import { useLocation, Link } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";

import { brainwave } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 bg-white/95 backdrop-blur-md ${
        openNavigation ? "bg-white" : "bg-white/95"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <Link className="block w-[12rem] xl:mr-8" to="/">
          <img src={brainwave} width={190} height={40} alt="Xacos CLI - Backend Scaffolding Tool" />
        </Link>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-white lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => {
              const isActive = item.url === pathname || 
                (item.url.startsWith('/#') && pathname === '/') ||
                (item.url === '/docs' && pathname.startsWith('/docs'));
              return item.url.startsWith('/#') ? (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={handleClick}
                  className={`block relative font-code text-2xl uppercase text-n-2 transition-colors hover:text-color-1 ${
                    item.onlyMobile ? "lg:hidden" : ""
                  } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                    isActive
                      ? "z-2 lg:text-n-1"
                      : "lg:text-n-4"
                  } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
                >
                  {item.title}
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={item.url}
                  onClick={handleClick}
                  className={`block relative font-code text-2xl uppercase text-n-2 transition-colors hover:text-color-1 ${
                    item.onlyMobile ? "lg:hidden" : ""
                  } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                    isActive
                      ? "z-2 lg:text-n-1"
                      : "lg:text-n-4"
                  } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>

          <HamburgerMenu />
        </nav>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="button hidden mr-8 text-n-4 transition-colors hover:text-n-1 lg:block"
        >
          GitHub
        </a>
        <Button className="hidden lg:flex" href="/#pricing">
          Get Started
        </Button>

        <Button
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
