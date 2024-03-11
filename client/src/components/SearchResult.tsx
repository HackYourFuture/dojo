import "./SearchResult.css"

export const SearchResult = ({result}: any) => {
  return(
    // [TODO]: change alert in onClick to navigate to profile page
    <div className="search-result" onClick={() => alert(`You clicked on ${result.name}`)}>{result.name}</div>
  )
}