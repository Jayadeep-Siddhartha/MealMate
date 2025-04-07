import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MenuItem } from "@/lib/types";

interface MenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentItem: MenuItem | null;
}

const MenuItemDialog = ({ open, onOpenChange, currentItem }: MenuItemDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{currentItem ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={currentItem?.name || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" defaultValue={currentItem?.category || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" defaultValue={currentItem?.price || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" defaultValue={currentItem?.description || ""} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemDialog;
