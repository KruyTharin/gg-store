import ReactPaginate from 'react-paginate';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Meta } from '@/types/interface';
import { cn } from '@/lib/utils';

interface Props {
  meta: Meta;
  currentItems: number;
  totalRows: number;
  className?: string;
}

const DEFAULT_PAGE = 1;

export const TableFooter = (props: Props) => {
  const { meta, currentItems, totalRows, className } = props;

  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();

  const offset = (meta.currentPage - 1) * meta.itemsPerPage;
  const startColumn = offset + 1;
  const endColumn = offset + currentItems;

  const currentPage = Number(searchParams.get('page')) || DEFAULT_PAGE;

  const onPageChange = (page: number) => {
    params.set('page', (page + 1).toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={cn('flex justify-between items-center  my-5', className)}>
      <TableFooterDisplayItems
        endColumn={endColumn}
        startColumn={startColumn}
        totalItems={meta.totalItems}
      />
      {!!totalRows && (
        <ReactPaginate
          className="flex gap-4 items-center"
          breakLabel="..."
          activeClassName="bg-primary text-white px-3 py-1 rounded-md"
          nextLabel={
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === meta.totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          }
          forcePage={currentPage - 1}
          onPageChange={({ selected }) => onPageChange(selected)}
          pageCount={meta.totalPages}
          previousLabel={
            <Button variant="outline" size="icon" disabled={currentPage === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
          }
          renderOnZeroPageCount={null}
        />
      )}
    </div>
  );
};

export const TableFooterDisplayItems = ({
  startColumn,
  endColumn,
  totalItems,
}: {
  startColumn: number;
  endColumn: number;
  totalItems: number;
}) => {
  return (
    <div>
      <span>
        Show from {startColumn} to {endColumn} of {''}
        {totalItems} Total
      </span>
    </div>
  );
};
