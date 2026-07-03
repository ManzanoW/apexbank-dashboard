"use client";

import React, { useState, useMemo } from 'react';
import { useTransactions } from './useTransactions';
import { useTheme } from './useTheme';
import { TransactionType, TransactionCategory } from './types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Plus, 
  Minus,
  Moon, 
  Sun, 
  ChevronLeft, 
  ChevronRight,
  Wallet,
  Activity,
  CheckCircle2,
  Tag,
  Trash2,
  Target,
  Calendar,
  AlertTriangle,
  X
} from 'lucide-react';

export default function TransactionDashboard() {
  const { 
    transactions, 
    totalCount, 
    balance, 
    filter, 
    setFilter, 
    dateFilter,
    setDateFilter,
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
    alert,
    clearAlert
  } = useTransactions();
  
  const { theme, toggleTheme, mounted } = useTheme();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('DEBIT');
  const [category, setCategory] = useState<TransactionCategory>('Alimentação');
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);

  const goalPercentage = useMemo(() => {
    return Math.min(100, Math.round((goal.currentSaved / goal.targetAmount) * 100));
  }, [goal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || Number(amount) <= 0) return;

    // Modificado: O envio agora verifica se a transação obteve sucesso ou falhou na rede
    const success = await addTransaction({ description, amount: Number(amount), type, category });
    
    if (success) {
      setShowSuccessFeedback(true);
      setDescription('');
      setAmount('');
      
      setTimeout(() => {
        setShowSuccessFeedback(false);
      }, 1500);
    }
  };

  return (
    <div className="p-6 font-sans max-w-xl mx-auto min-h-screen space-y-6 relative">
      
      {/* NOVO: Toast de Alerta Dinâmico para Falhas de Rede Simuladas */}
      {alert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-red-50 dark:bg-zinc-900 border border-red-200 dark:border-red-950/50 p-4 rounded-xl shadow-xl animate-fade-in flex items-start gap-3">
          <div className="text-bank-danger p-0.5 mt-0.5">
            <AlertTriangle size={16} className="animate-pulse" />
          </div>
          <div className="flex-1">
            <h5 className="text-xs font-black text-red-800 dark:text-red-400 uppercase tracking-wider">Erro de Sincronização</h5>
            <p className="text-xs font-medium text-red-700 dark:text-zinc-400 mt-1 leading-relaxed">{alert.message}</p>
          </div>
          <button 
            onClick={clearAlert}
            className="text-text-muted hover:text-text-main p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}
      
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
              <Moon size={15} className="text-indigo-500" />
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
            Distribuição do Período
          </p>
          {isLoading ? (
            <div className="h-20 w-full bg-border-custom/50 animate-pulse rounded-xl mt-2" />
          ) : chartData.length === 0 ? (
            <p className="text-[11px] text-text-muted font-medium m-auto">Sem despesas registradas neste período.</p>
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

      {/* Seção de Metas Financeiras */}
      <div className="bg-bg-card rounded-2xl shadow-xs border border-border-custom p-5">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 w-32 bg-border-custom/50 animate-pulse rounded" />
            <div className="h-3 w-full bg-border-custom/50 animate-pulse rounded-full" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                  <Target size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main">{goal.title}</h4>
                  <p className="text-xs text-text-muted">
                    Meta de {goal.targetAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateGoalAmount(goal.currentSaved - 50)}
                  disabled={goal.currentSaved <= 0}
                  className="p-1 border border-border-custom rounded-lg bg-bg-page text-text-main hover:bg-border-custom/30 cursor-pointer disabled:opacity-30 transition-all"
                >
                  <Minus size={12} />
                </button>
                <span className="text-xs font-bold text-text-main min-w-16 text-center">
                  {goal.currentSaved.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <button
                  onClick={() => updateGoalAmount(goal.currentSaved + 50)}
                  disabled={goal.currentSaved >= goal.targetAmount}
                  className="p-1 border border-border-custom rounded-lg bg-bg-page text-text-main hover:bg-border-custom/30 cursor-pointer disabled:opacity-30 transition-all"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-bg-page rounded-full h-2 overflow-hidden border border-border-custom">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${goalPercentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                <span>Progresso</span>
                <span>{goalPercentage}%</span>
              </div>
            </div>
          </div>
        )}
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
                  type === 'DEBIT' ? 'bg-red-50 dark:bg-red-950/20 text-bank-danger border-red-200 dark:border-red-900/40' : 'bg-bg-card text-text-muted border-border-custom hover:bg-bg-page'
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
                  type === 'CREDIT' ? 'bg-green-50 dark:bg-green-950/20 text-bank-success border-green-200 dark:border-green-900/40' : 'bg-bg-card text-text-muted border-border-custom hover:bg-bg-page'
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
              {isSubmitting ? 'Verificando rede...' : showSuccessFeedback ? <><CheckCircle2 size={14} /> Concluído</> : <><Plus size={14} /> Confirmar</>}
            </button>
          </div>
        </form>
      </div>

      {/* Seção do Extrato */}
      <div className="bg-bg-card rounded-2xl shadow-xs border border-border-custom p-5 space-y-4">
        <div className="flex flex-col gap-3 pb-3 border-b border-border-custom">
          <div className="flex items-center justify-between">
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
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    filter === t ? 'bg-bg-card text-text-main shadow-xs border border-border-custom' : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  {t === 'ALL' ? 'Todos' : t === 'CREDIT' ? 'Entradas' : 'Saídas'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-bold text-text-muted flex items-center gap-1">
              <Calendar size={12} />
              Filtrar por período:
            </span>
            <div className="flex gap-1 bg-bg-page/60 p-0.5 rounded-lg border border-border-custom/50">
              {([
                { key: 'ALL', label: 'Tudo' },
                { key: '7_DAYS', label: '7 dias' },
                { key: '30_DAYS', label: '30 dias' }
              ] as const).map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDateFilter(d.key)}
                  disabled={isLoading}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    dateFilter === d.key ? 'bg-bg-card text-text-main shadow-xs border border-border-custom' : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ul className="divide-y divide-border-custom mb-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="flex justify-between py-4 items-center">
                <div className="space-y-2"><div className="h-4 w-32 bg-border-custom/50 animate-pulse rounded-lg" /></div>
                <div className="h-4 w-20 bg-border-custom/50 animate-pulse rounded-lg" />
              </li>
            ))
          ) : transactions.length === 0 ? (
            <div className="text-center py-10 text-sm font-medium text-text-muted">Nenhuma movimentação encontrada neste período.</div>
          ) : (
            transactions.map((tx) => (
              <li key={tx.id} className="flex justify-between py-3.5 items-center hover:bg-bg-page/40 px-2.5 -mx-2.5 rounded-xl transition-all duration-200 animate-fade-in-down group">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${
                    tx.type === 'CREDIT' ? 'bg-green-50/50 dark:bg-green-950/10 text-bank-success border-green-100 dark:border-green-950/30' : 'bg-red-50/50 dark:bg-red-950/10 text-bank-danger border-red-100 dark:border-red-950/30'
                  }`}>
                    {tx.type === 'CREDIT' ? <ArrowUpCircle size={15} /> : <ArrowDownCircle size={15} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-main text-sm">{tx.description}</span>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border border-border-custom bg-bg-page text-text-muted flex items-center gap-0.5">
                        <Tag size={8} />
                        {tx.category}
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-text-muted mt-0.5">{tx.date}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`font-extrabold text-sm transition-all duration-200 group-hover:-translate-x-1 ${tx.type === 'CREDIT' ? 'text-bank-success' : 'text-bank-danger'}`}>
                    {tx.type === 'CREDIT' ? '+' : ''}
                    {tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                  
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-bank-danger hover:bg-red-50 dark:hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer scale-90 group-hover:scale-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
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