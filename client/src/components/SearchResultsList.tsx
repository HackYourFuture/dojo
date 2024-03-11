import { SearchResult } from "./SearchResult"
import "./SearchResultsList.css"

export const SearchResultsList = ({results}: any) => {
  return(
    <div className="results-list">
      {
        results.map((results: any, i: number) => {
          console.log(results)
          return <SearchResult result={results} key={i} />
        })
      }
    </div>
  )
}