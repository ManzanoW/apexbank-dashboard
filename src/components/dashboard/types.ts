export type TransactionType = 'CREDIT' | 'DEBIT';

// Definição das categorias aceitas no sistema
export type TransactionCategory = 'Alimentação' | 'Salário' | 'Lazer' | 'Moradia' | 'Outros';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory; // Novo campo
  date: string;
}

export interface CreateTransactionInput {
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory; // Novo campo
}