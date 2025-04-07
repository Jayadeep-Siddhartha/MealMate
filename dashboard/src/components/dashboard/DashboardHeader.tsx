import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  onMenuToggle: () => void;
}

const DashboardHeader = ({ title, onMenuToggle }: DashboardHeaderProps) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <Button variant="outline" size="icon" onClick={onMenuToggle}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
