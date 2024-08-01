import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal, Pencil } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { AuthRender } from '../auth-render';

interface GroupAction extends PropsWithChildren {
  onEdit: () => void;
}

export const CategoryActionButton: React.FC<GroupAction> = ({
  children,
  onEdit,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <AuthRender role="ADMIN">
          <DropdownMenuItem onClick={onEdit}>
            <div className="flex items-center space-x-1 cursor-pointer">
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </div>
          </DropdownMenuItem>
        </AuthRender>

        {/* <AuthRender role="ADMIN">
            <DropdownMenuItem onClick={onView}>
              <div className="flex items-center space-x-1 cursor-pointer">
                <Eye className="w-4 h-4" />
                <span>View</span>
              </div>
            </DropdownMenuItem>
          </AuthRender> */}
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
