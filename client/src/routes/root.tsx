import { Outlet } from "react-router-dom";
import NavbarComponent from "../components/navbarComponent";

export default function Root() {
  return (
    <>
      <div id="navbar">
      <NavbarComponent />
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
