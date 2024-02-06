export default function Root() {
  return (
    <>
      <div id="sidebar">
        <h1>Dojo Project</h1>
        <nav>
          <ul>
            <li>
              <a href={`/`}>Your Name</a>
            </li>
            <li>
              <a href={`/main`}>Your Friend</a>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail"></div>
    </>
  );
}
