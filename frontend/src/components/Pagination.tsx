import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: Props) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pb-4">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        className="h-10 rounded-xl px-3"
      >
        <ChevronLeft />
      </Button>

      <Badge variant="outline" className="h-10 rounded-xl px-4 text-sm font-medium">
        Page {currentPage} of {totalPages}
      </Badge>

      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        className="h-10 rounded-xl px-3"
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default Pagination;
