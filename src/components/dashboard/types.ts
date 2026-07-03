export type TransactionType = 'CREDIT' | 'DEBIT';
export type TransactionCategory = 'Alimentação' | 'Salário' | 'Lazer' | 'Moradia' | 'Outros';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
}

export interface CreateTransactionInput {
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
}

// NOVO: Tipo para a meta financeira
export interface SavingsGoal {
  title: string;
  targetAmount: number;
  currentSaved: number;
}