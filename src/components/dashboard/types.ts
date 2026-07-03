export type TransactionType = 'CREDIT' | 'DEBIT';
export type TransactionCategory = 'Alimentação' | 'Salário' | 'Lazer' | 'Moradia' | 'Outros';

// NOVO: Filtros de período aceitos
export type DateFilter = 'ALL' | '7_DAYS' | '30_DAYS';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string; // Formato YYYY-MM-DD
}

export interface CreateTransactionInput {
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
}

export interface SavingsGoal {
  title: string;
  targetAmount: number;
  currentSaved: number;
}