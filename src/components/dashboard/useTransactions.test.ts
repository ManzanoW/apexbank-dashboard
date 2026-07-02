import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { useTransactions } from './useTransactions';

describe('useTransactions - Domínio Bancário', () => {
  // Configura cronômetros simulados do Jest antes de cada teste
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve iniciar em estado de carregamento e depois expor os dados iniciais', async () => {
    const { result } = renderHook(() => useTransactions());

    // Estado inicial de loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.transactions).toEqual([]);

    // Avança o tempo no simulador para disparar o useEffect
    act(() => {
      jest.advanceTimersByTime(1200);
    });

    // Estado pós-carregamento
    expect(result.current.isLoading).toBe(false);
    expect(result.current.transactions.length).toBe(3);
    expect(result.current.balance).toBe(29.5);
  });

  it('deve adicionar uma transação de DÉBITO com valor negativo e recalcular o saldo', async () => {
    const { result } = renderHook(() => useTransactions());

    // Carrega dados iniciais
    act(() => {
      jest.advanceTimersByTime(1200);
    });

    let promise: Promise<void>;
    act(() => {
      promise = result.current.addTransaction({
        description: 'Café da manhã',
        amount: 20.00,
        type: 'DEBIT',
      });
    });

    expect(result.current.isSubmitting).toBe(true);

    await act(async () => {
      jest.advanceTimersByTime(1000);
      await promise;
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.transactions[0].description).toBe('Café da manhã');
    expect(result.current.transactions[0].amount).toBe(-20.00); 
    expect(result.current.balance).toBe(9.50);
  });

  it('deve filtrar transações por tipo CREDIT', () => {
    const { result } = renderHook(() => useTransactions());

    // CORREÇÃO: Aguarda o carregamento dos dados do Mock antes de filtrar
    act(() => {
      jest.advanceTimersByTime(1200);
    });

    act(() => {
      result.current.setFilter('CREDIT');
    });

    expect(result.current.filter).toBe('CREDIT');
    expect(result.current.transactions.every(t => t.type === 'CREDIT')).toBe(true);
    expect(result.current.transactions.length).toBe(1); // Pix Recebido
  });

  it('deve permitir limpar o filtro voltando para ALL', () => {
    const { result } = renderHook(() => useTransactions());

    // CORREÇÃO: Aguarda o carregamento dos dados do Mock antes de filtrar
    act(() => {
      jest.advanceTimersByTime(1200);
    });

    // Primeiro muda para um filtro específico
    act(() => {
      result.current.setFilter('DEBIT');
    });
    expect(result.current.transactions.length).toBe(2);

    // Agora volta para ALL
    act(() => {
      result.current.setFilter('ALL');
    });
    expect(result.current.transactions.length).toBe(3);
  });
});