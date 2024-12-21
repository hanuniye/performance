import Sidebar from "../components/Sidebar";
import { useGlobalProvider } from "../HOOKS/useGlobalProvider";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

const Layout = () => {
  const {
    sidebarToggle,
  } = useGlobalProvider();

  return (
    <div className="flex">
      {sidebarToggle && <Sidebar />}

      <div className="w-full">
        <Navbar />
        <Outlet />
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              textTransform: "capitalize",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Layout;