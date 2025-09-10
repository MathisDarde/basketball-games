import { Search } from "lucide-react"

export const CardResearch = ({ query, setQuery } : { query: string, setQuery: (value: string) => void}) => {
    return (
        <div className="p-4 relative">
          <input
            type="text"
            placeholder="Search for a card or a team"
            className="font-outfit text-sm rounded-sm w-full py-2 pl-4 pr-12 bg-white shadow"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search size={20} className="absolute right-7 top-1/2 -translate-y-1/2" />
        </div>
      )
}