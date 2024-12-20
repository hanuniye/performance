import { memo } from "react";
import { Link } from "react-router-dom";

const CustomButton = ({ text, url, icon, type, onclick, bg, color }) => {
  if (url) {
    return (
      <Link to={url}>
        <button
          type={type}
          className={`flex items-center justify-center space-x-2 ${bg ? bg : 'bg-blue-400'} w-fit px-3  py-1 mt-3 rounded-sm hover:cursor-pointer`}
        >
          <h5 className={`text-sm ${color ? color : 'text-white'} font-medium`}>{text}</h5>
          {icon ? icon : null}
        </button>
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onclick ? onclick : () => {}}
      className={`flex items-center justify-center space-x-2 ${bg ? bg : 'bg-blue-400'} w-fit px-3  py-1 mt-3 rounded-sm hover:cursor-pointer`}
    >
      <h5 className={`text-sm ${color ? color : 'text-white'} font-medium`}>{text}</h5>
      {icon ? icon : null}
    </button>
  );
};

export default memo(CustomButton);
