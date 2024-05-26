import { Outlet } from "react-router-dom";
//

import useUpdateToken from "../../hooks/use-update-token"
import SessionTimeOutPopup from '../../components/timeout-popup';
import ResponsiveAppBar from "../../components/navbar/user-menu";

//
const DashboardLayout = () => {
  useUpdateToken();
  //
  return (
    <div>
      <ResponsiveAppBar />
      <Outlet />
      <SessionTimeOutPopup />
    </div>
  );
};
//
export default DashboardLayout;
