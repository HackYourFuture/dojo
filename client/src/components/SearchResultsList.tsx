import { SearchResult } from "./SearchResult"
import "./SearchResultsList.css"

export const SearchResultsList = ({results}) => {
  return(
    <div className="results-list">
      {
        results.map((results, id: number) => {
          return <SearchResult result={results} key={id} />
        })
      }
    </div>
  )
}