import { AddTransactionModal } from "@/components/AddTransactionModal";
import { CarbonChart } from "@/components/CarbonChart";
import { InsightsPanel } from "@/components/InsightsPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TransactionList } from "@/components/TransactionList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Car,
    Home,
    Leaf,
    Lightbulb,
    MessageCircle,
    Plane,
    Plus,
    QrCode,
    ShoppingBag,
    Target,
    TrendingDown,
    TrendingUp
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  // Add a key to force refresh of transaction list when a new transaction is added
  const [transactionRefreshKey, setTransactionRefreshKey] = useState(0);
  
  // Mock data - in real app this would come from API
  const monthlyFootprint = 2.4; // tons CO2
  const monthlyTarget = 2.0;
  const lastMonthFootprint = 2.8;
  const yearlyReduction = 15; // percentage

  const categoryData = [
    { category: "Transport", amount: 0.8, icon: Car, color: "text-orange-500 dark:text-orange-400" },
    { category: "Energy", amount: 0.6, icon: Home, color: "text-yellow-500 dark:text-yellow-400" },
    { category: "Shopping", amount: 0.5, icon: ShoppingBag, color: "text-purple-500 dark:text-purple-400" },
    { category: "Travel", amount: 0.5, icon: Plane, color: "text-blue-500 dark:text-blue-400" }
  ];

  const footprintChange = ((monthlyFootprint - lastMonthFootprint) / lastMonthFootprint) * 100;

  const handleTransactionAdded = () => {
    // Close the modal
    setShowAddTransaction(false);
    // Refresh the transaction list
    setTransactionRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-accent dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Floating Theme Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        {/* Header */}
        <div className="text-center space-y-2 pt-8 pb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Leaf className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent dark:text-green-400">
              EcoTracker
            </h1>
          </div>
          <p className="text-muted-foreground dark:text-gray-300">Your personal carbon footprint companion</p>
        </div>

        {/* Main Footprint Card */}
        <Card className="bg-gradient-primary text-primary-foreground border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">This Month's Footprint</CardTitle>
            <div className="text-5xl font-bold">{monthlyFootprint}</div>
            <div className="text-xl opacity-90">tons CO₂e</div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {footprintChange < 0 ? (
                <TrendingDown className="h-5 w-5 text-green-200" />
              ) : (
                <TrendingUp className="h-5 w-5 text-red-200" />
              )}
              <span className="font-semibold">
                {Math.abs(footprintChange).toFixed(1)}% {footprintChange < 0 ? 'reduction' : 'increase'}
              </span>
              <span className="opacity-75">from last month</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm opacity-90">
                <span>Progress to target</span>
                <span>{monthlyTarget} tons</span>
              </div>
              <Progress 
                value={(monthlyTarget / monthlyFootprint) * 100} 
                className="h-2 bg-primary-foreground/20"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card dark:bg-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground dark:text-gray-300">Yearly Reduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary dark:text-green-400">{yearlyReduction}%</div>
                  <Badge variant="secondary" className="mt-1 dark:bg-gray-700 dark:text-gray-300">
                    <Target className="w-3 h-3 mr-1" />
                    On track
                  </Badge>
                </CardContent>
              </Card>
              
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground dark:text-gray-300">Eco Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary dark:text-green-400">B+</div>
                  <Badge variant="outline" className="mt-1 dark:border-gray-600 dark:text-gray-300">
                    <Lightbulb className="w-3 h-3 mr-1" />
                    Improving
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Categories Breakdown */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-gray-200">Carbon by Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryData.map(({ category, amount, icon: Icon, color }) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 ${color}`} />
                      <span className="font-medium dark:text-gray-200">{category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold dark:text-gray-200">{amount} tons</div>
                      <div className="text-sm text-muted-foreground dark:text-gray-400">
                        {((amount / monthlyFootprint) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Chart */}
            <CarbonChart key={`chart-${transactionRefreshKey}`} />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionList key={`transactions-${transactionRefreshKey}`} />
          </TabsContent>

          <TabsContent value="insights">
            <InsightsPanel key={`insights-${transactionRefreshKey}`} />
          </TabsContent>
        </Tabs>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-4">
          <Link to="/qrcode">
            <Button
              className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 hover:shadow-xl transition-all text-white"
              size="icon"
              title="Share QR Code"
            >
              <QrCode className="h-6 w-6" />
            </Button>
          </Link>
          <Link to="/chat">
            <Button
              className="h-14 w-14 rounded-full shadow-lg bg-green-600 hover:bg-green-700 hover:shadow-xl transition-all text-white"
              size="icon"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </Link>
          <Button
            onClick={() => setShowAddTransaction(true)}
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-primary hover:shadow-xl transition-all"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <AddTransactionModal 
        open={showAddTransaction} 
        onClose={handleTransactionAdded} 
      />
    </div>
  );
};

export default Dashboard;