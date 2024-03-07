import { Outlet } from "react-router-dom";
import ResponsiveNavbarComponent from "../components/navbarComponent";

export default function Root() {
  return (
    <>
      <div id="navbar">
      <ResponsiveNavbarComponent />
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
