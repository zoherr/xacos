import { notification1 } from "../assets";
import { notificationImages } from "../constants";

const Notification = ({ className = "", title }) => {
  return (
    <div
      className={`
        ${className}
        flex items-center gap-5
        p-4 pr-6
        rounded-2xl
        backdrop-blur-md
        bg-white/70 text-black
        dark:bg-black/60 dark:text-white
        border border-red-500/10
        shadow-sm
      `}
    >
      {/* Left Image */}
      <img
        src={notification1}
        width={62}
        height={62}
        alt="notification"
        className="rounded-xl object-cover"
      />

      <div className="flex-1">
        <h6 className="mb-1 text-base font-semibold">
          {title}
        </h6>

        <div className="flex items-center justify-between">
          {/* User Images */}
          <ul className="flex -space-x-1">
            {notificationImages.map((item, index) => (
              <li
                key={index}
                className="
                  w-6 h-6
                  rounded-full
                  overflow-hidden
                  border
                  border-red-500/10
                "
              >
                <img
                  src={item}
                  alt="user"
                  className="w-full h-full object-cover"
                />
              </li>
            ))}
          </ul>

          {/* Time */}
          <span className="text-xs text-black/60 dark:text-white/60">
            1m ago
          </span>
        </div>
      </div>
    </div>
  );
};

export default Notification;
