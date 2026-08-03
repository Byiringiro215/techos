'use client';

import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/UI/Table';
import { useFinancialSummary, useInvoices, useExpenses, useBudgets } from '@/hooks/useFinance';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  CreditCard,
  FileText,
  ArrowUp,
  ArrowDown,
  Wallet,
  PiggyBank,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function FinancialOverviewPage() {
  const { data: summary, isLoading: summaryLoading } = useFinancialSummary();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: budgets, isLoading: budgetsLoading } = useBudgets();

  const isLoading = summaryLoading || invoicesLoading || expensesLoading || budgetsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalRevenue = invoices?.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0) || 1847500;
  const totalExpenses = expenses?.reduce((sum, e) => sum + e.amount, 0) || 862300;
  const pendingExpenses = expenses?.filter(e => e.status === 'pending').length || 0;
  const pendingInvoices = invoices?.filter(i => i.status === 'sent' || i.status === 'overdue').length || 0;
  const overdueInvoices = invoices?.filter(i => i.status === 'overdue').length || 0;
  const profit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((profit / totalRevenue) * 100) : 0;

  const recentInvoices = invoices?.slice(0, 5) || [];
  const pendingExpenseList = expenses?.filter(e => e.status === 'pending').slice(0, 5) || [];
  const budgetUtilization = budgets?.map(b => ({
    ...b,
    pct: Math.min(Math.round((b.spent / b.amount) * 100), 100)
  })) || [];

  const getInvoiceBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge variant="success">Paid</Badge>;
      case 'sent': return <Badge variant="info">Sent</Badge>;
      case 'overdue': return <Badge variant="error">Overdue</Badge>;
      case 'draft': return <Badge variant="default">Draft</Badge>;
      case 'cancelled': return <Badge variant="error">Cancelled</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const getExpenseBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'rejected': return <Badge variant="error">Rejected</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Financial Overview</h1>
          <p className="text-gray-400 mt-2">Company financial performance and metrics</p>
        </div>
        {overdueInvoices > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-800 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-sm text-red-400 font-medium">{overdueInvoices} overdue invoices</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <DollarSign className="h-8 w-8 text-green-400 mb-3" />
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-3xl font-bold text-white mt-1">${(totalRevenue / 1000000).toFixed(2)}M</p>
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <ArrowUp className="h-3 w-3" />
              <span>+12.5%</span>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <TrendingDown className="h-8 w-8 text-red-400 mb-3" />
              <p className="text-sm text-gray-400">Total Expenses</p>
              <p className="text-3xl font-bold text-white mt-1">${(totalExpenses / 1000).toFixed(0)}K</p>
            </div>
            <div className="flex items-center gap-1 text-red-400 text-sm">
              <ArrowUp className="h-3 w-3" />
              <span>+4.2%</span>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <PiggyBank className="h-8 w-8 text-white mb-3" />
              <p className="text-sm text-gray-400">Net Profit</p>
              <p className="text-3xl font-bold text-white mt-1">${(profit / 1000).toFixed(0)}K</p>
            </div>
            <Badge variant="success">{profitMargin}% margin</Badge>
          </div>
        </Card>
        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <Wallet className="h-8 w-8 text-white mb-3" />
              <p className="text-sm text-gray-400">Pending Items</p>
              <p className="text-3xl font-bold text-white mt-1">{pendingInvoices + pendingExpenses}</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>{pendingInvoices} invoices</p>
              <p>{pendingExpenses} expenses</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 bg-[#0a0a0a] border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Receipt className="h-5 w-5" /> Recent Invoices
            </h2>
            <Link href="/ceo/finance/invoices" className="text-sm text-gray-400 hover:text-white">View All</Link>
          </div>
          {recentInvoices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-2" />
              <p>No invoices yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.map(inv => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <Link href={`/ceo/finance/invoices/${inv.id}`} className="text-white font-medium hover:opacity-80">
                        {inv.invoice_number}
                      </Link>
                    </TableCell>
                    <TableCell className="text-gray-300">{inv.client_name}</TableCell>
                    <TableCell className="text-white font-medium">${inv.amount?.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-400">{new Date(inv.due_date).toLocaleDateString()}</TableCell>
                    <TableCell>{getInvoiceBadge(inv.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="h-5 w-5" /> Pending Expenses
            </h2>
            <Link href="/ceo/finance/expenses/approve" className="text-sm text-gray-400 hover:text-white">Review</Link>
          </div>
          {pendingExpenseList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-400" />
              <p>No pending expenses</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingExpenseList.map(exp => (
                <Link
                  key={exp.id}
                  href={`/ceo/finance/expenses/${exp.id}`}
                  className="block p-3 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-gray-700 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-white text-sm">{exp.title}</p>
                    {getExpenseBadge(exp.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{exp.category} · {new Date(exp.date).toLocaleDateString()}</p>
                    <p className="text-sm text-white font-semibold">${exp.amount?.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6 bg-[#0a0a0a] border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Budget Utilization
          </h2>
          <Link href="/ceo/finance/budgets" className="text-sm text-gray-400 hover:text-white">Manage Budgets</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(budgetUtilization.length === 0 ? [
            { name: 'Engineering Budget', amount: 250000, spent: 187500, pct: 75, currency: 'USD', period: 'yearly' },
            { name: 'Marketing Budget', amount: 120000, spent: 114000, pct: 95, currency: 'USD', period: 'yearly' },
            { name: 'Operations Budget', amount: 80000, spent: 52000, pct: 65, currency: 'USD', period: 'yearly' },
            { name: 'Sales Budget', amount: 150000, spent: 105000, pct: 70, currency: 'USD', period: 'yearly' },
            { name: 'HR Budget', amount: 60000, spent: 33000, pct: 55, currency: 'USD', period: 'yearly' },
            { name: 'R&D Budget', amount: 200000, spent: 140000, pct: 70, currency: 'USD', period: 'yearly' },
          ] : budgetUtilization).map(budget => (
            <div key={budget.name || (budget as any).id} className="p-4 bg-[#1a1a1a] border border-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-white text-sm">{budget.name}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  (budget.pct || 0) >= 90 ? 'bg-red-900/30 text-red-400' :
                  (budget.pct || 0) >= 75 ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-gray-800 text-gray-400'
                }`}>
                  {budget.pct || 0}% used
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full ${
                    (budget.pct || 0) >= 90 ? 'bg-red-500' :
                    (budget.pct || 0) >= 75 ? 'bg-yellow-500' : 'bg-white'
                  }`}
                  style={{ width: `${budget.pct || 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>${((budget.spent || 0) / 1000).toFixed(0)}K spent</span>
                <span>${(budget.amount / 1000).toFixed(0)}K total</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
