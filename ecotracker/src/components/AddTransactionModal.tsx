import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { serverStatus } from "@/lib/axios";
import { ecoTrackerApi } from "@/services/api";
import {
    AlertCircle,
    Calculator,
    Car,
    Home,
    InfoIcon,
    Plane,
    ShoppingBag,
    Utensils,
    Zap
} from "lucide-react";
import { useState } from "react";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
}

const categories = [
  { value: "transport", label: "Transport", icon: Car, factor: 0.2, material: "Petroleum Products" },
  { value: "energy", label: "Energy", icon: Zap, factor: 0.5, material: "Steel" },
  { value: "food", label: "Food & Dining", icon: Utensils, factor: 0.1, material: "Wheat" },
  { value: "shopping", label: "Shopping", icon: ShoppingBag, factor: 0.08, material: "Cotton" },
  { value: "travel", label: "Travel", icon: Plane, factor: 0.8, material: "Petroleum Products" },
  { value: "housing", label: "Housing", icon: Home, factor: 0.3, material: "Timber" },
];

export const AddTransactionModal = ({ open, onClose }: AddTransactionModalProps) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const selectedCategory = categories.find(c => c.value === category);
  const estimatedCarbon = selectedCategory && amount 
    ? (parseFloat(amount) * selectedCategory.factor).toFixed(2)
    : "0.00";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !description) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCategory) return;
    
    setLoading(true);

    try {
      // Get current date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      // Submit to API
      const response = await ecoTrackerApi.addTransaction({
        category: selectedCategory.material, // Map to materials used in backend
        description: description,
        amount: parseFloat(amount),
        date: today
      });

      toast({
        title: "Transaction added!",
        description: `Added ${description} with ${estimatedCarbon} kg CO₂ impact`,
      });
      
      // Reset form
      setAmount("");
      setCategory("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Add Transaction</span>
            {!serverStatus.isOnline && (
              <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-500">
                <InfoIcon className="h-3 w-3 mr-1" />
                <span>Offline Mode</span>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {!serverStatus.isOnline && (
          <div className="mb-4 text-sm p-3 rounded-md bg-yellow-500/10 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">You're currently offline</p>
                <p className="mt-1 text-xs">Your transaction will be saved locally and synced when connection is restored.</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Grocery shopping, Gas fill-up"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (£)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{cat.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedCategory && amount && (
            <Card className="bg-accent/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Estimated carbon impact</span>
                  </div>
                  <span className="font-bold text-primary">{estimatedCarbon} kg CO₂</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" text="Adding..." /> : "Add Transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};