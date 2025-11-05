import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";

export default function Shop() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold">Shop</h1>
          <p className="text-muted-foreground mt-2">E-commerce shop page - Coming soon</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}

