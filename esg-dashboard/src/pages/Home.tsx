import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { ProductionDataTable } from "@/components/ProductionDataTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Production Data Overview</h2>
                    <p className="text-muted-foreground">View and analyse production data across different branches</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700" asChild>
                    <Link to="/form">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Entry
                    </Link>
                </Button>
            </div>

            <DashboardCharts />
            <ProductionDataTable />
        </div>
    );
}
