import { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, TransactionCategory, CreateTransactionInput } from './types';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'Pix Recebido - João', amount: 1500.00, type: 'CREDIT', category: 'Salário', date: '2026-07-01' },
  { id: '2', description: 'Pagamento Mercado', amount: -350.00, type: 'DEBIT', category: 'Alimentação', date: '2026-07-02' },
  { id: '3', description: 'Assinatura Streaming', amount: -45.90, type: 'DEBIT', category: 'Lazer', date: '2026-07-03' },
  { id: '4', description: 'Conta de Energia', amount: -120.50, type: 'DEBIT', category: 'Moradia', date: '2026-07-04' },
];

const ITEMS_PER_PAGE = 3;

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSetFilter = (newFilter: TransactionType | 'ALL') => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const filteredTransactions = useMemo(() => {
    if (filter === 'ALL') return transactions;
    return transactions.filter(t => t.type === filter);
  }, [transactions, filter]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE) || 1;
  }, [filteredTransactions]);

  const balance = useMemo(() => {
    return transactions.reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  // NOVO: Gráfico agora exibe a distribuição de despesas por CATEGORIA
  const chartData = useMemo(() => {
    const categories: Record<TransactionCategory, number> = {
      'Alimentação': 0,
      'Lazer': 0,
      'Moradia': 0,
      'Salário': 0,
      'Outros': 0
    };

    // Filtra apenas os débitos (saídas) para criar o gráfico de distribuição de gastos
    transactions
      .filter(t => t.type === 'DEBIT')
      .forEach(t => {
        categories[t.category] += Math.abs(t.amount);
      });

    return Object.keys(categories)
      .map(key => ({
        name: key,
        valor: categories[key as TransactionCategory],
        fill: key === 'Alimentação' ? '#3b82f6' : key === 'Lazer' ? '#ec4899' : key === 'Moradia' ? '#eab308' : '#71717a'
      }))
      .filter(item => item.valor > 0); // Só mostra no gráfico categorias que possuem gastos
  }, [transactions]);

  const addTransaction = async (input: CreateTransactionInput) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      description: input.description,
      amount: input.type === 'DEBIT' ? -Math.abs(input.amount) : Math.abs(input.amount),
      type: input.type,
      category: input.category,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setCurrentPage(1);
    setIsSubmitting(false);
  };

  return {
    transactions: paginatedTransactions,
    totalCount: filteredTransactions.length,
    balance,
    filter,
    setFilter: handleSetFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
    isSubmitting,
    addTransaction,
    chartData,
  };
}