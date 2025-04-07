import { MenuItem } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface MenuSectionProps {
  isMenuDialogOpen: boolean;
  setIsMenuDialogOpen: (open: boolean) => void;
  currentMenuItem: MenuItem | null;
  setCurrentMenuItem: (item: MenuItem | null) => void;
}

const demoMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 120,
    description: "Delicious creamy paneer curry.",
  },
  {
    id: "2",
    name: "Masala Dosa",
    category: "South Indian",
    price: 60,
    description: "Crispy dosa with spicy potato filling.",
  },
];

const MenuSection = ({
  isMenuDialogOpen,
  setIsMenuDialogOpen,
  setCurrentMenuItem,
}: MenuSectionProps) => {
  const handleEdit = (item: MenuItem) => {
    setCurrentMenuItem(item);
    setIsMenuDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Menu Items</h2>
        <Button onClick={() => setIsMenuDialogOpen(true)}>Add Item</Button>
      </div>
      <ul className="space-y-4">
        {demoMenuItems.map((item) => (
          <li
            key={item.id}
            className="bg-white p-4 shadow rounded-lg flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="text-sm text-gray-700">{item.description}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">₹{item.price}</p>
              <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                Edit
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuSection;
