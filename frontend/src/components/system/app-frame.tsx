import { Outlet } from "react-router-dom";
import { GlobalPageLoader } from "./global-page-loader";

export function AppFrame() {
  return (
    <>
      <GlobalPageLoader />
      <Outlet />
    </>
  );
}
