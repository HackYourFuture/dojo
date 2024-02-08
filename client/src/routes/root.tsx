import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <div id="sidebar">
        <h1>Dojo Project</h1>
        <nav>
          <ul>
            <li>
              <a href={`/`}></a>
            </li>
            <li>
              <a href={`/search`}>Search</a>
            </li>
            <li>
              <a href={`/login`}>Login</a>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
