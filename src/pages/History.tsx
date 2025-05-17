
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { investments, getPackageById } from "@/lib/data-service";
import { useAuth } from "@/contexts/AuthContext";
import useFormat from "@/hooks/useFormat";

export default function History() {
  const navigate = useNavigate();
  const { mains } = useAuth()
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Sorted and processed investments
  const sortedInvestments = [...investments].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc'
        ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        : new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    } else {
      return sortOrder === 'asc'
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
  });
  
  // Handle sort change
  const handleSort = (column: 'date' | 'amount') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Investment History</h1>
          <Button 
            onClick={() => navigate('/packages')}
            className="bg-gradient-to-r from-finance-teal to-finance-blue hover:opacity-90"
          >
            New Investment
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Investments</CardTitle>
          </CardHeader>
          <CardContent>
            {mains?.user_investments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      Date
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer"
                      onClick={() => handleSort('amount')}
                    >
                      Amount
                    </TableHead>
                    <TableHead className="text-right">Returns</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mains?.user_investments.map((investment) => {
                    return (
                      <TableRow key={investment.ID}>
                        <TableCell className="font-medium">
                          {investment.product_name}
                        </TableCell>
                        <TableCell>
                          {formatDate(investment.investment_date)}
                        </TableCell>
                        <TableCell className="text-right">
                          Kes {useFormat(investment.amount)}
                        </TableCell>
                        <TableCell className="text-right text-finance-green">
                          +Kes {useFormat(investment.total_returns)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={investment.status === 'Active' 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                            }
                          >
                            {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/investments/${investment.ID}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No investment history found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
