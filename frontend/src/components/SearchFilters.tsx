import { Search, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  source: string;
  setSource: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
}

const SearchFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  source,
  setSource,
  sort,
  setSort,
}: Props) => {
  return (
    <Card className="border-white/50 bg-white/80 shadow-none dark:border-white/10 dark:bg-slate-950/55">
      <CardHeader className="p-6 pb-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Refine the queue</CardTitle>
            <CardDescription>
              Search by contact info and tighten the table to the leads that matter right now.
            </CardDescription>
          </div>
          <div className="rounded-2xl bg-primary/12 p-3 text-primary">
            <SlidersHorizontal className="size-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
        <div className="relative md:col-span-2">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-xl bg-background/70 pl-11 pr-4"
          />
        </div>

        <Select
          value={status || "all"}
          onValueChange={(value) => setStatus(value === "all" ? "" : value)}
        >
          <SelectTrigger className="h-11 rounded-xl bg-background px-4">
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={source || "all"}
          onValueChange={(value) => setSource(value === "all" ? "" : value)}
        >
          <SelectTrigger className="h-11 rounded-xl bg-background px-4">
            <SelectValue placeholder="All sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="Website">Website</SelectItem>
            <SelectItem value="Instagram">Instagram</SelectItem>
            <SelectItem value="Referral">Referral</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="h-11 rounded-xl bg-background px-4 md:col-span-2">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
