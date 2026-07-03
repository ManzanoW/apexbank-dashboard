"use client";

import React, { useState } from 'react';
import { useTransactions } from './useTransactions';
import { useTheme } from './useTheme';
import { TransactionType, TransactionCategory } from './types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Plus, 
  Moon, 
  Sun, 
  ChevronLeft, 
  ChevronRight,
  Wallet,
  Activity,
  CheckCircle2,
  Tag
} from 'lucide-react';

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
  
  const { theme, toggleTheme, mounted } = useTheme();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('DEBIT');
  const [category, setCategory] = useState<TransactionCategory>('Alimentação');
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || Number(amount) <= 0) return;

    await addTransaction({ description, amount: Number(amount), type, category });
    
    setShowSuccessFeedback(true);
    setDescription('');
    setAmount('');
    
    setTimeout(() => {
      setShowSuccessFeedback(false);
    }, 1500);
  };

  return (
    <div className="p-6 font-sans max-w-xl mx-auto min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-border-custom">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 bg-btn-bg text-btn-text rounded-xl flex items-center justify-center shadow-md shadow-text-main/5 font-black text-xl tracking-tighter">
            A
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-text-main">ApexBank</h2>
            <p className="text-xs font-medium text-text-muted">Gestão Inteligente</p>
          </div>
        </div>
        
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-border-custom bg-bg-card hover:bg-bg-page text-text-main hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-xs transition-all duration-200 flex items-center gap-2 text-xs font-bold"
        >
          {!mounted ? (
            <>
              <div className="h-4 w-4 rounded-full bg-border-custom animate-pulse" />
              <span>Tema</span>
            </>
          ) : theme === 'light' ? (
            <>
              <Moon size={15} className="text-indigo-500 animate-pulse" />
              <span>Escuro</span>
            </>
          ) : (
            <>
              <Sun size={15} className="text-amber-500" />
              <span>Claro</span>
            </>
          )}
        </button>
      </div>
      
      {/* Grid de Resumos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-bg-card p-5 rounded-2xl shadow-xs border border-border-custom flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform text-text-main">
            <Wallet size={80} />
          </div>
          <div>
            <p className="m-0 text-xs text-text-muted font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Wallet size={13} />
              Saldo Disponível
            </p>
            {isLoading ? (
              <div className="h-9 w-40 bg-border-custom/50 animate-pulse rounded-lg mt-3" />
            ) : (
              <h3 className="m-0 mt-2 text-3xl font-black tracking-tight text-text-main">
                {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            )}
          </div>
        </div>

        <div className="bg-bg-card p-4 rounded-2xl shadow-xs border border-border-custom h-36 flex flex-col justify-between">
          <p className="text-xs text-text-muted font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Activity size={13} />
            Distribuição de Despesas
          </p>
          {isLoading ? (
            <div className="h-20 w-full bg-border-custom/50 animate-pulse rounded-xl mt-2" />
          ) : chartData.length === 0 ? (
            <p className="text-[11px] text-text-muted font-medium m-auto">Sem despesas registradas para análise.</p>
          ) : (
            <ResponsiveContainer width="100%" height="75%">
              <BarChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--color-text-muted)', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-muted)', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(value: unknown) => {
                    if (value === undefined || value === null) return ['', 'Total'];
                    const rawValue = Array.isArray(value) ? value[0] : value;
                    return [Number(rawValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 'Gasto'];
                  }}
                  contentStyle={{ 
                    backgroundColor: 'var(--color-bg-card)', 
                    borderColor: 'var(--color-border-custom)',
                    color: 'var(--color-text-main)',
                    fontSize: '11px', 
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="valor" radius={[5, 5, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Formulário de Nova Transação */}
      <div className="bg-bg-card rounded-2xl shadow-xs border border-border-custom p-5">
        <h4 className="text-sm font-bold text-text-main mb-4">Lançamento Rápido</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-text-muted mb-1.5">Descrição</label>
              <input
                type="text"
                placeholder="Ex: Aluguel"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting || isLoading}
                className="w-full text-sm font-medium px-3 py-2.5 bg-bg-page border border-border-custom rounded-xl text-text-main focus:outline-none focus:ring-2 focus:ring-text-main/5 focus:border-text-main placeholder:text-text-muted/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isSubmitting || isLoading}
                className="w-full text-sm font-medium px-3 py-2.5 bg-bg-page border border-border-custom rounded-xl text-text-main focus:outline-none focus:ring-2 focus:ring-text-main/5 focus:border-text-main placeholder:text-text-muted/50"
                required
              />
            </div>
            <div>
              {/* NOVO: Campo de Categoria */}
              <label className="block text-xs font-bold text-text-muted mb-1.5">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                disabled={isSubmitting || isLoading}
                className="w-full text-sm font-semibold px-3 py-2.5 bg-bg-page border border-border-custom rounded-xl text-text-main focus:outline-none focus:ring-2 focus:ring-text-main/5 focus:border-text-main cursor-pointer"
              >
                <option value="Alimentação">Alimentação</option>
                <option value="Salário">Salário</option>
                <option value="Lazer">Lazer</option>
                <option value="Moradia">Moradia</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('DEBIT')}
                disabled={isSubmitting || isLoading}
                className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  type === 'DEBIT' 
                    ? 'bg-red-50 dark:bg-red-950/20 text-bank-danger border-red-200 dark:border-red-900/40' 
                    : 'bg-bg-card text-text-muted border-border-custom hover:bg-bg-page'
                }`}
              >
                <ArrowDownCircle size={14} />
                Saída
              </button>
              <button
                type="button"
                onClick={() => setType('CREDIT')}
                disabled={isSubmitting || isLoading}
                className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  type === 'CREDIT' 
                    ? 'bg-green-50 dark:bg-green-950/20 text-bank-success border-green-200 dark:border-green-900/40' 
                    : 'bg-bg-card text-text-muted border-border-custom hover:bg-bg-page'
                }`}
              >
                <ArrowUpCircle size={14} />
                Entrada
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading || !description || !amount}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl hover:-translate-y-0.5 active:scale-95 shadow-md transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 ${
                showSuccessFeedback ? 'bg-bank-success text-white' : 'bg-btn-bg text-btn-text'
              }`}
            >
              {isSubmitting ? 'Processando...' : showSuccessFeedback ? <><CheckCircle2 size={14} className="animate-bounce" /> Sucesso!</> : <><Plus size={14} /> Confirmar</>}
            </button>
          </div>
        </form>
      </div>

      {/* Seção do Extrato */}
      <div className="bg-bg-card rounded-2xl shadow-xs border border-border-custom p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-text-main">Histórico de Transações</h4>
            <p className="text-[11px] font-semibold text-text-muted mt-0.5">Mostrando {transactions.length} de {totalCount} registros</p>
          </div>
          <div className="flex gap-1 bg-bg-page p-1 rounded-xl border border-border-custom">
            {(['ALL', 'CREDIT', 'DEBIT'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                disabled={isLoading}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  filter === t ? 'bg-bg-card text-text-main shadow-xs border border-border-custom' : 'text-text-muted hover:text-text-main'
                }`}
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
                <div className="space-y-2"><div className="h-4 w-32 bg-border-custom/50 animate-pulse rounded-lg" /></div>
                <div className="h-4 w-20 bg-border-custom/50 animate-pulse rounded-lg" />
              </li>
            ))
          ) : transactions.length === 0 ? (
            <div className="text-center py-10 text-sm font-medium text-text-muted">Nenhuma movimentação encontrada.</div>
          ) : (
            transactions.map((tx) => (
              <li key={tx.id} className="flex justify-between py-3.5 items-center hover:bg-bg-page/40 px-2.5 -mx-2.5 rounded-xl transition-all duration-200 animate-fade-in-down">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${
                    tx.type === 'CREDIT' ? 'bg-green-50/50 dark:bg-green-950/10 text-bank-success border-green-100 dark:border-green-950/30' : 'bg-red-50/50 dark:bg-red-950/10 text-bank-danger border-red-100 dark:border-red-950/30'
                  }`}>
                    {tx.type === 'CREDIT' ? <ArrowUpCircle size={15} /> : <ArrowDownCircle size={15} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-main text-sm">{tx.description}</span>
                      {/* NOVO: Tag Visual da Categoria */}
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border border-border-custom bg-bg-page text-text-muted flex items-center gap-0.5">
                        <Tag size={8} />
                        {tx.category}
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-text-muted mt-0.5">{tx.date}</div>
                  </div>
                </div>
                <span className={`font-extrabold text-sm ${tx.type === 'CREDIT' ? 'text-bank-success' : 'text-bank-danger'}`}>
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
              className="p-1.5 border border-border-custom rounded-lg bg-bg-card hover:bg-bg-page text-text-main disabled:opacity-30 cursor-pointer transition-all flex items-center gap-1 text-xs font-bold"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-text-muted font-bold">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-border-custom rounded-lg bg-bg-card hover:bg-bg-page text-text-main disabled:opacity-30 cursor-pointer transition-all flex items-center gap-1 text-xs font-bold"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}