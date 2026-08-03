import { Invoice, Expense, Budget } from '@/types/finance';
import { mockEntities } from './entities';

const MOCK_ORG_ID = 'org-techos-demo';

/** Map mock invoice records into the shape expected by existing finance pages. */
export function getMockInvoices(): Invoice[] {
  return (mockEntities.invoices || []).map((row) => {
    const statusRaw = row.status.toLowerCase();
    const status: Invoice['status'] = statusRaw.includes('paid')
      ? 'paid'
      : statusRaw.includes('overdue')
        ? 'overdue'
        : statusRaw.includes('cancel')
          ? 'cancelled'
          : statusRaw.includes('sent')
            ? 'sent'
            : 'draft';

    return {
      id: row.id,
      org_id: MOCK_ORG_ID,
      invoice_number: row.title,
      client_name: row.company || row.owner,
      client_email: row.email,
      amount: typeof row.amount === 'number' ? row.amount : 0,
      currency: row.currency || 'USD',
      status,
      issue_date: row.createdAt,
      due_date: row.dueDate || row.updatedAt,
      paid_date: status === 'paid' ? row.updatedAt : undefined,
      notes: row.description,
      created_at: row.createdAt,
    };
  });
}

/** Map mock expense records into the shape expected by existing finance pages. */
export function getMockExpenses(): Expense[] {
  return (mockEntities.expenses || []).map((row) => {
    const statusRaw = row.status.toLowerCase();
    const status: Expense['status'] = statusRaw.includes('approve')
      ? 'approved'
      : statusRaw.includes('reject')
        ? 'rejected'
        : 'pending';

    return {
      id: row.id,
      org_id: MOCK_ORG_ID,
      title: row.title,
      description: row.description,
      amount: typeof row.amount === 'number' ? row.amount : 0,
      currency: row.currency || 'USD',
      category: row.category || 'General',
      date: row.dueDate || row.createdAt,
      submitted_by: row.owner,
      status,
      approved_by: status === 'approved' ? 'Finance Team' : undefined,
      approval_date: status === 'approved' ? row.updatedAt : undefined,
      rejection_reason: status === 'rejected' ? row.description : undefined,
      created_at: row.createdAt,
    };
  });
}

/** Map mock budget records into the shape expected by existing finance pages. */
export function getMockBudgets(): Budget[] {
  return (mockEntities.budgets || []).map((row) => {
    const amount = typeof row.amount === 'number' ? row.amount : 0;
    const spent = Math.round((amount * (row.progress ?? 0)) / 100);

    return {
      id: row.id,
      org_id: MOCK_ORG_ID,
      name: row.title,
      category: row.category || 'General',
      amount,
      spent,
      currency: row.currency || 'USD',
      period: 'yearly',
      start_date: row.createdAt,
      end_date: row.updatedAt,
      created_at: row.createdAt,
    };
  });
}

/** Mirrors the `{ total_income, total_expenses, net_profit, profit_margin }` shape returned by GET /finance/summary. */
export function getMockFinancialSummary() {
  const invoices = getMockInvoices();
  const expenses = getMockExpenses();

  const totalIncome = invoices
    .filter((inv) => inv.status === 'paid' || inv.status === 'sent')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalExpenses = expenses
    .filter((exp) => exp.status === 'approved')
    .reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  return {
    total_income: totalIncome,
    total_expenses: totalExpenses,
    net_profit: netProfit,
    profit_margin: totalIncome > 0 ? Number(((netProfit / totalIncome) * 100).toFixed(2)) : 0,
  };
}
