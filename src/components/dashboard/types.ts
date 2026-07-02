export type TransactionType = 'CREDIT' | 'DEBIT';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
}

// Tipo específico para a criação de uma nova transação pelo usuário
export interface CreateTransactionInput {
  description: string;
  amount: number;
  type: TransactionType;
}