import { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, CreateTransactionInput } from './types';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'Pix Recebido - João', amount: 500.00, type: 'CREDIT', date: '2026-07-01' },
  { id: '2', description: 'Pagamento Boleto Luz', amount: -120.50, type: 'DEBIT', date: '2026-07-02' },
  { id: '3', description: 'Supermercado', amount: -350.00, type: 'DEBIT', date: '2026-07-02' },
];

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredTransactions = useMemo(() => {
    if (filter === 'ALL') return transactions;
    return transactions.filter(t => t.type === filter);
  }, [transactions, filter]);

  const balance = useMemo(() => {
    return transactions.reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  // NOVO: Agrupa dados financeiros para alimentar o gráfico de forma limpa
  const chartData = useMemo(() => {
    const income = transactions.filter(t => t.type === 'CREDIT').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'DEBIT').reduce((acc, t) => acc + Math.abs(t.amount), 0);

    return [
      { name: 'Entradas', valor: income, fill: 'var(--color-bank-success)' },
      { name: 'Saídas', valor: expense, fill: 'var(--color-bank-danger)' }
    ];
  }, [transactions]);

  const addTransaction = async (input: CreateTransactionInput) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      description: input.description,
      amount: input.type === 'DEBIT' ? -Math.abs(input.amount) : Math.abs(input.amount),
      type: input.type,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setIsSubmitting(false);
  };

  return {
    transactions: filteredTransactions,
    balance,
    filter,
    setFilter,
    isLoading,
    isSubmitting,
    addTransaction,
    chartData, // Exposto para a UI
  };
}