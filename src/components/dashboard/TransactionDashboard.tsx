"use client";

import React, { useState, ComponentProps } from 'react';
import { useTransactions } from './useTransactions';
import { TransactionType } from './types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function TransactionDashboard() {
  const { transactions, balance, filter, setFilter, isLoading, isSubmitting, addTransaction, chartData } = useTransactions();
  
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
    <div className="p-6 font-sans max-w-xl mx-auto min-h-screen bg-gray-50/50 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">ApexBank</h2>
          <p className="text-xs text-gray-500">Painel de Controle Financeiro</p>
        </div>
      </div>
      
      {/* Grid de Resumos (Saldo + Gráfico) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card de Saldo */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200/80 flex flex-col justify-center">
          <p className="m-0 text-xs text-gray-500 font-semibold uppercase tracking-wider">Saldo Total Disponível</p>
          {isLoading ? (
            <div className="h-9 w-40 bg-gray-200 animate-pulse rounded-md mt-2" />
          ) : (
            <h3 className="m-0 mt-1 text-3xl font-bold tracking-tight text-gray-900">
              {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h3>
          )}
        </div>

        {/* Card de Análise Gráfica */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200/80 h-36">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Fluxo de Caixa</p>
          {isLoading ? (
            <div className="h-20 w-full bg-gray-100 animate-pulse rounded-md" />
          ) : (
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip 
                    formatter={(value: unknown) => {
                        // 1. Tratamento defensivo caso o valor seja nulo ou indefinido
                        if (value === undefined || value === null) return ['', 'Total'];
    
                        // 2. Tratamento defensivo caso o Recharts passe uma array de valores
                        const rawValue = Array.isArray(value) ? value[0] : value;
    
                        // 3. Conversão segura para número
                        const numericValue = Number(rawValue);
    
                        // Se a conversão falhar e gerar um NaN, exibe o valor original como string de forma segura
                        if (isNaN(numericValue)) return [String(rawValue), 'Total'];

                        return [
                            numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
                            'Total'
                        ];
                    }}
                    contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                />
                <Bar dataKey="valor" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Formulário de Nova Transação */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-5">
        <h4 className="text-sm font-bold text-gray-900 mb-4">Nova Movimentação</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
              <input
                type="text"
                placeholder="Ex: Aluguel, Salário"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting || isLoading}
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 disabled:opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isSubmitting || isLoading}
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 disabled:opacity-50"
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
                className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                  type === 'DEBIT' ? 'bg-red-50 text-bank-danger border-red-200' : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                Saída (Débito)
              </button>
              <button
                type="button"
                onClick={() => setType('CREDIT')}
                disabled={isSubmitting || isLoading}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                  type === 'CREDIT' ? 'bg-green-50 text-bank-success border-green-200' : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                Entrada (Crédito)
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading || !description || !amount}
              className="bg-bank-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40"
            >
              {isSubmitting ? 'Processando...' : 'Lançar Transação'}
            </button>
          </div>
        </form>
      </div>

      {/* Seção do Extrato */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-gray-900">Histórico de Transações</h4>
          <div className="flex gap-1.5 bg-gray-100 p-1 rounded-lg">
            {(['ALL', 'CREDIT', 'DEBIT'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                disabled={isLoading}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all disabled:opacity-50
                  ${filter === t ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {t === 'ALL' ? 'Todos' : t === 'CREDIT' ? 'Entradas' : 'Saídas'}
              </button>
            ))}
          </div>
        </div>

        <ul className="divide-y divide-gray-100 border-t border-gray-100">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="flex justify-between py-4 items-center">
                <div className="space-y-2"><div className="h-4 w-32 bg-gray-200 animate-pulse rounded" /></div>
                <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
              </li>
            ))
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">Nenhuma movimentação encontrada.</div>
          ) : (
            transactions.map((tx) => (
              <li key={tx.id} className="flex justify-between py-3.5 items-center hover:bg-gray-50/50 px-2 -mx-2 rounded-lg transition-colors">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{tx.description}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{tx.date}</div>
                </div>
                <span className={`font-bold text-sm ${tx.type === 'CREDIT' ? 'text-bank-success' : 'text-bank-danger'}`}>
                  {tx.type === 'CREDIT' ? '+' : ''}
                  {tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}