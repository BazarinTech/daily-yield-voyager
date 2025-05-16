
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useFormat from "@/hooks/useFormat";

interface InvestFormProps {
  packageData?: Product;
  isOpen: boolean;
  onClose: () => void;
  onInvest: (packageId: string, amount: number) => void;
  userBalance: number;
}

const investmentSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Amount must be positive")
});

export default function InvestForm({
  packageData,
  isOpen,
  onClose,
  onInvest,
  userBalance,
}: InvestFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof investmentSchema>>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      amount: packageData?.min || 100,
    },
  });

  const onSubmit = async (values: z.infer<typeof investmentSchema>) => {
    if (!packageData) return;
    
    // Validate amount against package constraints
    if (values.amount < packageData.min) {
      toast({
        title: "Investment too small",
        description: `Minimum investment for this package is Kes ${ useFormat(packageData.min)}`,
        variant: "destructive",
      });
      return;
    }

    if (values.amount > packageData.max) {
      toast({
        title: "Investment too large",
        description: `Maximum investment for this package is Kes ${useFormat(packageData.max)}`,
        variant: "destructive",
      });
      return;
    }

    // Validate amount against user balance
    if (values.amount > userBalance) {
      toast({
        title: "Insufficient balance",
        description: `Your balance is Kes ${ useFormat(userBalance)}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      onInvest(packageData.ID, values.amount);
      toast({
        title: "Investment successful",
        description: `You've successfully invested Kes ${useFormat(values.amount)} in ${packageData.name}`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Investment failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!packageData) return null;

  // Calculate estimated returns
  const calculateEstimatedReturns = () => {
    const amount = form.getValues("amount") || 0;
    const min = (amount * packageData.return * packageData.duration) / 100;
    const max = (amount * packageData.return * packageData.duration) / 100;
    return { min: min.toFixed(2), max: max.toFixed(2) };
  };
  
  const { min, max } = calculateEstimatedReturns();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invest in {packageData.name}</DialogTitle>
          <DialogDescription>
            Enter your investment amount below.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <p className="text-sm">Package details:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-secondary/50 p-2 rounded-md">
                    <p className="text-muted-foreground">Min Investment</p>
                    <p className="font-medium">Kes {useFormat(packageData.min)}</p>
                  </div>
                  <div className="bg-secondary/50 p-2 rounded-md">
                    <p className="text-muted-foreground">Max Investment</p>
                    <p className="font-medium">Kes {useFormat(packageData.max)}</p>
                  </div>
                  <div className="bg-secondary/50 p-2 rounded-md">
                    <p className="text-muted-foreground">Daily Return</p>
                    <p className="font-medium">
                      {packageData.return}
                    </p>
                  </div>
                  <div className="bg-secondary/50 p-2 rounded-md">
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">{packageData.duration} days</p>
                  </div>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          Kes
                        </span>
                        <Input 
                          type="number" 
                          className="pl-7" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            form.trigger("amount"); // Trigger validation on change
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="flex justify-between">
                      <span>Available Balance: Kes { useFormat(userBalance)}</span>
                      <button 
                        type="button" 
                        className="text-primary text-xs"
                        onClick={() => form.setValue("amount", Math.min(userBalance, packageData.max))}
                      >
                        Max
                      </button>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="bg-secondary/30 p-3 rounded-md space-y-1">
                <p className="text-sm font-medium">Estimated returns:</p>
                <p className="text-sm">
                  <span className="text-finance-green font-medium">Kes { useFormat(min)}</span> over {packageData.duration} days
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-finance-teal to-finance-blue hover:opacity-90"
              >
                {loading ? "Processing..." : "Invest Now"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
