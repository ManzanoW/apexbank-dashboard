import { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, TransactionCategory, CreateTransactionInput, SavingsGoal, DateFilter, SystemAlert } from './types';

const INITIAL_MOCK_TRANSACTIONS: Transaction[] = [];

const DEFAULT_GOAL: SavingsGoal = {
  title: 'Reserva de Emergência',
  targetAmount: 5000,
  currentSaved: 0
};

const ITEMS_PER_PAGE = 3;

// NOVO: Função utilitária para emular latência de rede e falhas de conexão de API (15% de chance de erro)
const simulateApiCall = async <T>(data: T): Promise<T> => {
  const latency = Math.floor(Math.random() * 800) + 800; // Entre 800ms e 1600ms
  await new Promise((resolve) => setTimeout(resolve, latency));
  
  const hasNetworkFailure = Math.random() < 0.15; // 15% de chance de queda de conexão
  if (hasNetworkFailure) {
    throw new Error('Falha na conexão com o servidor. Verifique sua internet e tente novamente.');
  }
  
  return data;
};

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goal, setGoal] = useState<SavingsGoal>(DEFAULT_GOAL);
  const [filter, setFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [dateFilter, setDateFilter] = useState<DateFilter>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NOVO: Estado para gerenciar notificações globais do sistema financeiro
  const [alert, setAlert] = useState<SystemAlert | null>(null);

  useEffect(() => {
    const savedTransactions = localStorage.getItem('apexbank_transactions');
    const savedGoal = localStorage.getItem('apexbank_goal');
    
    const timer = setTimeout(() => {
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      } else {
        setTransactions(INITIAL_MOCK_TRANSACTIONS);
        localStorage.setItem('apexbank_transactions', JSON.stringify(INITIAL_MOCK_TRANSACTIONS));
      }

      if (savedGoal) {
        setGoal(JSON.parse(savedGoal));
      } else {
        localStorage.setItem('apexbank_goal', JSON.stringify(DEFAULT_GOAL));
      }
      
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSetFilter = (newFilter: TransactionType | 'ALL') => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSetDateFilter = (newDateFilter: DateFilter) => {
    setDateFilter(newDateFilter);
    setCurrentPage(1);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesType = filter === 'ALL' || t.type === filter;
      if (!matchesType) return false;
      if (dateFilter === 'ALL') return true;

      const transactionDate = new Date(t.date + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      transactionDate.setHours(0, 0, 0, 0);

      const differenceInTime = today.getTime() - transactionDate.getTime();
      const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

      if (dateFilter === '7_DAYS') return differenceInDays <= 7;
      if (dateFilter === '30_DAYS') return differenceInDays <= 30;
      
      return true;
    });
  }, [transactions, filter, dateFilter]);

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

  const chartData = useMemo(() => {
    const categories: Record<TransactionCategory, number> = {
      'Alimentação': 0, 'Lazer': 0, 'Moradia': 0, 'Salário': 0, 'Outros': 0
    };
    filteredTransactions.filter(t => t.type === 'DEBIT').forEach(t => {
      categories[t.category] += Math.abs(t.amount);
    });
    return Object.keys(categories).map(key => ({
      name: key,
      valor: categories[key as TransactionCategory],
      fill: key === 'Alimentação' ? '#3b82f6' : key === 'Lazer' ? '#ec4899' : key === 'Moradia' ? '#eab308' : '#71717a'
    })).filter(item => item.valor > 0);
  }, [filteredTransactions]);

  // ALTERADO: Adicionado pipeline de resiliência assíncrona try/catch com simulação de barramento de rede
  const addTransaction = async (input: CreateTransactionInput): Promise<boolean> => {
    setIsSubmitting(true);
    setAlert(null); // Limpa alertas anteriores antes do processamento

    try {
      const payload: Transaction = {
        id: Math.random().toString(36).substring(2, 9),
        description: input.description,
        amount: input.type === 'DEBIT' ? -Math.abs(input.amount) : Math.abs(input.amount),
        type: input.type,
        category: input.category,
        date: new Date().toISOString().split('T')[0],
      };

      // Dispara o barramento que pode falhar
      const verifiedTransaction = await simulateApiCall(payload);

      const updatedTransactions = [verifiedTransaction, ...transactions];
      setTransactions(updatedTransactions);
      localStorage.setItem('apexbank_transactions', JSON.stringify(updatedTransactions));
      setCurrentPage(1);
      setIsSubmitting(false);
      return true; // Sucesso absoluto na transação
    } catch (error) {
      setIsSubmitting(false);
      const errorMessage = error instanceof Error ? error.message : 'Erro crítico desconhecido.';
      setAlert({ message: errorMessage, type: 'ERROR' });
      return false; // Transação falhou na rede simulada
    }
  };

  const deleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    localStorage.setItem('apexbank_transactions', JSON.stringify(updatedTransactions));
    const maxPages = Math.ceil(updatedTransactions.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > maxPages) setCurrentPage(maxPages);
  };

  const updateGoalAmount = (amountToSave: number) => {
    const updatedGoal = { ...goal, currentSaved: Math.max(0, amountToSave) };
    setGoal(updatedGoal);
    localStorage.setItem('apexbank_goal', JSON.stringify(updatedGoal));
  };

  const clearAlert = () => setAlert(null);

  return {
    transactions: paginatedTransactions,
    totalCount: filteredTransactions.length,
    balance,
    filter,
    setFilter: handleSetFilter,
    dateFilter,
    setDateFilter: handleSetDateFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
    isSubmitting,
    addTransaction,
    chartData,
    deleteTransaction,
    goal,
    updateGoalAmount,
    alert, // Exportado
    clearAlert // Exportado
  };
}