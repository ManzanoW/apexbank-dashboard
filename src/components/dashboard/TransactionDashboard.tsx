"use client";

import React, { useState } from 'react';
import { useTransactions } from './useTransactions';
import { useTheme } from './useTheme';
import { TransactionType } from './types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function TransactionDashboard() {
  const { 
    transactions, 
    totalCount, 
    balance, 
    filter, 
    setFilter, 
    currentPage, 
    setCurrentPage, 
    totalPages, 
    isLoading, 
    isSubmitting, 
    addTransaction, 
    chartData 
  } = useTransactions();
  
  const { theme, toggleTheme } = useTheme();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('DEBIT');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || Number(amount) <= 0) return;

    await addTransaction({ description, amount: Number(amount), type });
    setDescription('');
    setAmount('');
  };

  return (
    <div className="p-6 font-sans max-w-xl mx-auto min-h-screen space-y-6">
      
      {/* Header Avançado com Alternador de Tema */}
      <div className="flex items-center justify-between pb-4 border-b border-border-custom">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-text-main">ApexBank</h2>
          <p className="text-xs text-text-muted">Painel de Controle Financeiro</p>
        </div>
        
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-border-custom bg-bg-card hover:bg-bg-page cursor-pointer shadow-xs text-sm"
          title="Alternar Tema"
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>
      
      {/* Grid de Resumos (Estilização de Elevação Sutil) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card de Saldo */}
        <div className="bg-bg-card p-5 rounded-2xl shadow-xs border border-border-custom flex flex-col justify-center">
          <p className="m-0 text-xs text-text-muted font-bold uppercase tracking-wider">Saldo Disponível</p>
          {isLoading ? (
            <div className="h-9 w-40 bg-border-custom animate-pulse rounded-md mt-2" />
          ) : (
            <h3 className="m-0 mt-1 text-3xl font-extrabold tracking-tight text-text-main">
              {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h3>
          )}
        </div>

        {/* Card de Análise Gráfica */}
        <div className="bg-bg-card p-4 rounded-2xl shadow-xs border border-border-custom h-36">
          <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-2">Fluxo de Caixa</p>
          {isLoading ? (
            <div className="h-20 w-full bg-border-custom animate-pulse rounded-md" />
          ) : (
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(value: unknown) => {
                    if (value === undefined || value === null) return ['', 'Total'];
                    const rawValue = Array.isArray(value) ? value[0] : value;
                    return [Number(rawValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 'Total'];
                  }}
                  contentStyle={{ 
                    backgroundColor: 'var(--color-bg-card)', 
                    borderColor: 'var(--color-border-custom)',
                    color: 'var(--color-text-main)',
                    fontSize: '12px', 
                    borderRadius: '8px' 
                  }}
                />
                <Bar dataKey="valor" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Formulário de Nova Transação */}
      <div className="bg-bg-card rounded-2xl shadow-xs border border-border-custom p-5">
        <h4 className="text-sm font-bold text-text-main mb-4">Nova Movimentação</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">Descrição</label>
              <input
                type="text"
                placeholder="Ex: Aluguel"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting || isLoading}
                className="w-full text-sm px-3 py-2 bg-bg-page border border-border-custom rounded-xl text-text-main focus:outline-none focus:ring-2 focus:ring-text-main/10 focus:border-text-main disabled:opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isSubmitting || isLoading}
                className="w-full text-sm px-3 py-2 bg-bg-page border border-border-custom rounded-xl text-text-main focus:outline-none focus:ring-2 focus:ring-text-main/10 focus:border-text-main disabled:opacity-50"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('DEBIT')}
                disabled={isSubmitting || isLoading}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  type === 'DEBIT' 
                    ? 'bg-red-50 dark:bg-red-950/30 text-bank-danger border-red-200 dark:border-red-900/50' 
                    : 'bg-bg-card text-text-muted border-border-custom'
                }`}
              >
                Saída
              </button>
              <button
                type="button"
                onClick={() => setType('CREDIT')}
                disabled={isSubmitting || isLoading}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  type === 'CREDIT' 
                    ? 'bg-green-50 dark:bg-green-950/30 text-bank-success border-green-200 dark:border-green-900/50' 
                    : 'bg-bg-card text-text-muted border-border-custom'
                }`}
              >
                Entrada
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading || !description || !amount}
              className="bg-btn-bg text-btn-text text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40"
            >
              {isSubmitting ? 'Processando...' : 'Lançar Transação'}
            </button>
          </div>
        </form>
      </div>

      {/* Seção do Extrato */}
      <div className="bg-bg-card rounded-2xl shadow-xs border border-border-custom p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-text-main">Histórico de Transações</h4>
            <p className="text-[11px] text-text-muted mt-0.5">Mostrando {transactions.length} de {totalCount} registros</p>
          </div>
          <div className="flex gap-1.5 bg-bg-page p-1 rounded-xl border border-border-custom">
            {(['ALL', 'CREDIT', 'DEBIT'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                disabled={isLoading}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50
                  ${filter === t ? 'bg-bg-card text-text-main shadow-xs' : 'text-text-muted hover:text-text-main'}`}
              >
                {t === 'ALL' ? 'Todos' : t === 'CREDIT' ? 'Entradas' : 'Saídas'}
              </button>
            ))}
          </div>
        </div>

        <ul className="divide-y divide-border-custom border-t border-border-custom mb-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="flex justify-between py-4 items-center">
                <div className="space-y-2"><div className="h-4 w-32 bg-border-custom animate-pulse rounded" /></div>
                <div className="h-4 w-20 bg-border-custom animate-pulse rounded" />
              </li>
            ))
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-sm text-text-muted">Nenhuma movimentação encontrada.</div>
          ) : (
            transactions.map((tx) => (
              <li key={tx.id} className="flex justify-between py-3.5 items-center hover:bg-bg-page/50 px-2 -mx-2 rounded-xl transition-colors">
                <div>
                  <div className="font-semibold text-text-main text-sm">{tx.description}</div>
                  <div className="text-xs text-text-muted mt-0.5">{tx.date}</div>
                </div>
                <span className={`font-bold text-sm ${tx.type === 'CREDIT' ? 'text-bank-success' : 'text-bank-danger'}`}>
                  {tx.type === 'CREDIT' ? '+' : ''}
                  {tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </li>
            ))
          )}
        </ul>

        {/* Barra de Navegação */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between pt-3 border-t border-border-custom">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-xs font-bold border border-border-custom rounded-lg bg-bg-card hover:bg-bg-page text-text-main disabled:opacity-40 cursor-pointer disabled:cursor-default transition-colors"
            >
              Anterior
            </button>
            <span className="text-xs text-text-muted font-bold">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-xs font-bold border border-border-custom rounded-lg bg-bg-card hover:bg-bg-page text-text-main disabled:opacity-40 cursor-pointer disabled:cursor-default transition-colors"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}