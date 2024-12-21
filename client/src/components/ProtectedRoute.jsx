import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGlobalProvider } from "../HOOKS/useGlobalProvider";

const ProtectedRoutes = ({ allowedRoles }) => {
  const { auth } = useGlobalProvider();
  const location = useLocation();

  return allowedRoles?.includes(auth?.role) ? (
    <Outlet />
  ) : auth?.userData ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    //state={{ from: location }} replace waxay kugu celinaysaa meshii ad ka timi markad unauthorized so adysay
    <Navigate to="/login" state={{ from: location }} replace />
    //state={{ from: location }} replace waxay kugu celinaysaa meshii ad ka timi markad login so adysay
  );
};

export default ProtectedRoutes;
