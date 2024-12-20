import {
  Search,
  Menu,
  LanguageOutlined,
  DarkModeOutlined,
  FullscreenExitOutlined,
  NotificationsNoneOutlined,
  ChatBubbleOutlineOutlined,
  ListOutlined,
} from "@mui/icons-material";
import { useGlobalProvider } from "../HOOKS/useGlobalProvider";
import { memo } from "react";
import nophoto from "../assets/no-photo.png";

const Navbar = () => {
  const { sidebarToggle, setSidebarToggle } = useGlobalProvider();

  return (
    <div className="navbar flex justify-between items-center px-5 py-2 border-b-2">
      {/* left  */}
      <div className="left flex items-center space-x-5 ">
        <Menu
          onClick={() => setSidebarToggle(!sidebarToggle)}
          style={{ fontSize: "18px", cursor: "pointer" }}
        />
      </div>

      {/* right */}
      <div className="right flex space-x-3 items-center">
        <div className="image">
          <img
            className="w-10 h-10 rounded-full"
            // src={user?.image ? user.image : nophoto}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Navbar);
