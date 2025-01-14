import {
  Dashboard,
  PeopleAltOutlined,
  StoreOutlined,
  CreditCard,
  LocalShippingOutlined,
  InsertChartOutlined,
  NotificationsNone,
  SettingsSystemDaydreamOutlined,
  PsychologyOutlined,
  SettingsApplications,
  AccountCircleOutlined,
  ExitToApp,
  KeyboardArrowDownOutlined,
  KeyboardArrowUpOutlined,
  FiberManualRecord,
  Work,
  Leaderboard,
  ChatRounded,
  BookTwoTone,
  People,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import { useGlobalProvider } from "../HOOKS/useGlobalProvider";
import useLogout from "../HOOKS/useLogout";

const Sidebar = () => {
  const navigate = useNavigate();
  const { auth } = useGlobalProvider();
  const logout = useLogout();

  return (
    <div className="sidebar flex flex-col py-5 shadow-md w-52 h-[100vh]">
      <div className="logo pb-3 border-b-2 flex justify-center items-center">
        <img src="/care2.png" alt="logo" className="h-6 w-[100px]" />
      </div>

      {/* center */}
      <div className="links flex flex-col">
        {/* main  */}
        <div className="flex flex-col justify-between space-y-2 mt-3">
          <h6 className="title text-sm ml-5 font-medium text-blackLight">
            Main
          </h6>
          <Link to="/">
            <div className="flex items-center pl-7 py-2 space-x-3 hover:bg-likHover hover:cursor-pointer">
              <Dashboard
                className="text-orange-500 icon"
                style={{ fontSize: "18px" }}
              />
              <h6 className="text-sm font-medium text-blackLight md:text-md">
                Dashboard
              </h6>
            </div>
          </Link>
        </div>

        {/* lists  */}
        <div className="flex flex-col justify-between space-y-2 mt-5">
          <h6 className="title text-sm ml-5 font-medium text-blackLight">
            Lists
          </h6>
          {/* HR  */}
          {auth?.role === "HR" && (
            <div>
              <div
                className="flex justify-between items-center pl-7 pr-3 py-2 space-x-3 hover:bg-likHover hover:cursor-pointer"
                onClick={() => {
                  navigate("/HR");
                }}
              >
                <div className="flex items-center space-x-3">
                  <Leaderboard
                    className="text-orange-500 icon"
                    style={{ fontSize: "18px" }}
                  />
                  <h6 className="text-sm font-medium text-blackLight md:text-md">
                    HR
                  </h6>
                </div>
              </div>
            </div>
          )}
          {/* Performance  */}
          <div>
            <div
              className="flex justify-between items-center pl-7 pr-3 py-2 space-x-3 hover:bg-likHover hover:cursor-pointer"
              onClick={() => {
                navigate("/performance_reviews");
              }}
            >
              <div className="flex items-center space-x-3">
                <ChatRounded
                  className="text-orange-500 icon"
                  style={{ fontSize: "18px" }}
                />
                <h6 className="text-sm font-medium text-blackLight md:text-md">
                  Performance
                </h6>
              </div>
            </div>
          </div>
          {/* Supervisors  */}
          {auth?.role === "HR" && (
            <div>
              <div
                className="flex justify-between items-center pl-7 pr-3 py-2 space-x-3 hover:bg-likHover hover:cursor-pointer"
                onClick={() => {
                  navigate("/supervisors");
                }}
              >
                <div className="flex items-center space-x-3">
                  <BookTwoTone
                    className="text-orange-500 icon"
                    style={{ fontSize: "18px" }}
                  />
                  <h6 className="text-sm font-medium text-blackLight md:text-md">
                    Supervisors
                  </h6>
                </div>
              </div>
            </div>
          )}
          {/* Employees  */}
          {auth?.role === "HR" && (
            <div>
              <div
                className="flex justify-between items-center pl-7 pr-3 py-2 space-x-3 hover:bg-likHover hover:cursor-pointer"
                onClick={() => {
                  navigate("/employees");
                }}
              >
                <div className="flex items-center space-x-3">
                  <People
                    className="text-orange-500 icon"
                    style={{ fontSize: "18px" }}
                  />
                  <h6 className="text-sm font-medium text-blackLight md:text-md">
                    Employees
                  </h6>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between space-y-2 mt-5">
          <h6 className="title text-sm ml-5 font-medium text-blackLight">
            User
          </h6>
          <div
            className="flex items-center pl-7 py-2 space-x-3 hover:bg-likHover hover:cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <AccountCircleOutlined
              className="text-orange-500 icon"
              style={{ fontSize: "18px" }}
            />
            <h6 className="text-sm font-medium text-blackLight md:text-md">
              Profile
            </h6>
          </div>
          <div
            className="flex items-center pl-7 py-2 space-x-3 hover:bg-likHover hover:cursor-pointer"
            onClick={() => logout()}
          >
            <ExitToApp
              className="text-orange-500 icon"
              style={{ fontSize: "18px" }}
            />
            <h6 className="text-sm font-medium text-blackLight md:text-md">
              Logout
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
