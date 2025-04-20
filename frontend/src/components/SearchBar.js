"use client";

export default function SearchBar({ query, setQuery, onSearch }) {
    return (
      <div className="flex w-full gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your memory..."
          className="w-full px-4 py-2 border rounded-xl shadow"
        />
        <button
          onClick={onSearch}
          className="px-4 py-2 bg-black text-white rounded-xl shadow hover:bg-gray-800 cursor-pointer"
        >
          Search
        </button>
      </div>
    );
}
  