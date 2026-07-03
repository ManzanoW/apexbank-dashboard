export type TransactionType = 'CREDIT' | 'DEBIT';
export type TransactionCategory = 'Alimentação' | 'Salário' | 'Lazer' | 'Moradia' | 'Outros';
export type DateFilter = 'ALL' | '7_DAYS' | '30_DAYS';

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

export interface SavingsGoal {
  title: string;
  targetAmount: number;
  currentSaved: number;
}

// NOVO: Interface para controle de alertas/toasts de erro no sistema
export interface SystemAlert {
  message: string;
  type: 'ERROR' | 'SUCCESS';
}