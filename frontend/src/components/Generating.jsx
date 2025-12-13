import { useState } from "react";
import { Clipboard, Check } from "lucide-react";

const Generating = ({ className = "" }) => {
  const command = "npx xacos init my-api --ts --prisma";
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`
        flex items-center justify-between
        h-[3.5rem] px-5
        rounded-xl border
        backdrop-blur-md
        bg-white/70 text-black
        dark:bg-black/60 dark:text-white
        border-black/10 dark:border-white/10
        ${className}
      `}
    >
      {/* Command */}
      <code className="text-sm font-mono select-all">
        {command}
      </code>

      {/* Copy Icon Button */}
      <button
        onClick={copyToClipboard}
        aria-label="Copy command"
        className="
          ml-4 p-2
          rounded-md
          border
          border-black/10 dark:border-white/20
          hover:bg-black/10 dark:hover:bg-white/10
          transition
        "
      >
        {copied ? (
          <Check size={16} className="text-green-500" />
        ) : (
          <Clipboard size={16} />
        )}
      </button>
    </div>
  );
};

export default Generating;
