import ButtonSvg from "../assets/svg/ButtonSvg";

const Button = ({
  className = "",
  href,
  onClick,
  children,
  px = "px-7",
  disabled = false,
  type = "button",
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center
    h-11 ${px}
    rounded-xl
    font-medium
    text-black
    backdrop-blur-md
    bg-white/80
    border border-red-500/15
    transition-all duration-300
    focus:outline-none focus-visible:ring-2
    focus-visible:ring-red-500/30
    disabled:opacity-50 disabled:pointer-events-none
    overflow-hidden
  `;

  const hoverEffect = `
    before:absolute before:inset-0
    before:bg-gradient-to-r
    before:from-red-500/0
    before:via-red-500/10
    before:to-red-500/0
    before:opacity-0
    hover:before:opacity-100
    before:transition-opacity before:duration-300
  `;

  const classes = `${baseClasses} ${hoverEffect} ${className}`;
  const spanClasses = "relative z-10 flex items-center gap-2";

  const Content = (
    <>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(false)}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} aria-disabled={disabled}>
        {Content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {Content}
    </button>
  );
};

export default Button;
