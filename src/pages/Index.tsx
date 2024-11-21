import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpRight, TrendingUp } from "lucide-react";
import debounce from "lodash/debounce";

interface Story {
  objectID: string;
  title: string;
  points: number;
  url: string;
  num_comments: number;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: stories, isLoading } = useQuery({
    queryKey: ["stories", searchTerm],
    queryFn: async () => {
      const baseUrl = "https://hn.algolia.com/api/v1";
      const endpoint = searchTerm
        ? `/search?query=${encodeURIComponent(searchTerm)}`
        : "/search?tags=front_page";
      const response = await fetch(`${baseUrl}${endpoint}`);
      const data = await response.json();
      return data.hits as Story[];
    },
  });

  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-500">Top Stories</span>
          </div>
          <h1 className="text-4xl font-bold mb-8">Hacker News</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="pl-10 h-12"
              placeholder="Search stories..."
              onChange={handleSearchChange}
            />
          </div>
        </header>

        <main>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="p-6 rounded-lg border story-card">
                  <div className="skeleton h-6 w-3/4 mb-4 rounded"></div>
                  <div className="skeleton h-4 w-1/4 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {stories?.map((story) => (
                <article
                  key={story.objectID}
                  className="p-6 rounded-lg border story-card group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h2 className="font-semibold text-lg mb-2 group-hover:text-gray-900">
                        {story.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {story.points} points
                        </span>
                        <span>
                          {story.num_comments} comments
                        </span>
                      </div>
                    </div>
                    {story.url && (
                      <a
                        href={story.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Read more"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;