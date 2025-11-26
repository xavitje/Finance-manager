import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, TrendingUp, Coffee, PiggyBank, Plus, Trash2, DollarSign } from 'lucide-react';

// De hoofdcomponent van de applicatie
const App = () => {
  // State voor inkomsten, uitgaven en allocatiepercentages
  const [salary, setSalary] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '' });
  const [savingsPercent, setSavingsPercent] = useState(20);
  const [funPercent, setFunPercent] = useState(10);

  // Firestore variabelen
  // LET OP: Firebase is niet geinitialiseerd in dit bestand, maar dit toont aan hoe je de userId zou gebruiken
  // const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  // const userId = auth.currentUser?.uid || 'anonymous-user';

  // Functie om data op te slaan (in een echte app zou je dit naar Firestore sturen)
  const saveData = useCallback((data) => {
    // Voor deze single-file demo gebruiken we localStorage om state persistent te maken
    localStorage.setItem('financeTrackerData', JSON.stringify(data));
  }, []);

  // Functie om data te laden
  useEffect(() => {
    const storedData = localStorage.getItem('financeTrackerData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setSalary(data.salary || '');
      setExpenses(data.expenses || []);
      setSavingsPercent(data.savingsPercent || 20);
      setFunPercent(data.funPercent || 10);
    }
  }, []); // Eén keer laden bij opstarten

  // Effect om data op te slaan wanneer de state verandert
  useEffect(() => {
    const dataToSave = {
      salary,
      expenses,
      savingsPercent,
      funPercent,
    };
    saveData(dataToSave);
  }, [salary, expenses, savingsPercent, funPercent, saveData]);

  const addExpense = () => {
    if (newExpense.name && newExpense.amount) {
      const amount = parseFloat(newExpense.amount);
      if (isNaN(amount) || amount <= 0) {
          console.error("Ongeldig bedrag ingevoerd.");
          return;
      }
      setExpenses([...expenses, { 
        id: Date.now(), 
        name: newExpense.name, 
        amount: amount
      }]);
      setNewExpense({ name: '', amount: '' });
    }
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const salaryNum = parseFloat(salary) || 0;
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Berekeningen
  const savingsAmount = (salaryNum * savingsPercent) / 100;
  const funAmount = (salaryNum * funPercent) / 100;
  const remaining = salaryNum - totalExpenses - savingsAmount - funAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Wallet className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Finance Tracker
            </h1>
          </div>
          <p className="text-gray-600">Beheer je salaris, uitgaven en spaargeld op één plek</p>
        </div>

        {/* Salary Input */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Maandelijks Salaris (Netto)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Voer je maandelijks salaris in"
              className="w-full pl-12 pr-4 py-4 text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Sparen</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold">€{savingsAmount.toFixed(2)}</p>
            <p className="text-xs md:text-sm opacity-75 mt-1">{savingsPercent}% van salaris</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Coffee className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Vrij Besteedbaar</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold">€{funAmount.toFixed(2)}</p>
            <p className="text-xs md:text-sm opacity-75 mt-1">{funPercent}% van salaris</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Vaste Lasten</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold">€{totalExpenses.toFixed(2)}</p>
            <p className="text-xs md:text-sm opacity-75 mt-1">{expenses.length} posten</p>
          </div>

          <div className={`bg-gradient-to-br ${remaining >= 0 ? 'from-blue-500 to-indigo-600' : 'from-gray-500 to-gray-700'} rounded-xl p-5 text-white shadow-lg`}>
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Over (Budget)</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold">€{remaining.toFixed(2)}</p>
            <p className="text-xs md:text-sm opacity-75 mt-1">Na alle aftrekkingen</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Allocation Settings */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Allocatie Instellingen</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Spaarpercentage: {savingsPercent}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={savingsPercent}
                onChange={(e) => setSavingsPercent(parseInt(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-green-200 to-green-500 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vrij Besteedbaar Percentage: {funPercent}%
              </label>
              <input
                type="range"
                min="0"
                max="30"
                value={funPercent}
                onChange={(e) => setFunPercent(parseInt(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-purple-200 to-purple-500 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {salaryNum > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">Budget Overzicht:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salaris:</span>
                    <span className="font-semibold">€{salaryNum.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">- Sparen ({savingsPercent}%):</span>
                    <span className="font-semibold text-green-600">-€{savingsAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">- Vrij Besteedbaar ({funPercent}%):</span>
                    <span className="font-semibold text-purple-600">-€{funAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">- Vaste Lasten:</span>
                    <span className="font-semibold text-orange-600">-€{totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                    <span className="font-semibold text-gray-700">Resterend:</span>
                    <span className={`font-bold ${remaining >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      €{remaining.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Expenses */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Maandelijkse Uitgaven (Vaste Lasten)</h2>
            
            <div className="space-y-3 mb-4">
              <input
                type="text"
                value={newExpense.name}
                onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                placeholder="Naam uitgave (bv. Huur, Verzekering)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
              />
              <div className="flex gap-3">
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  placeholder="Bedrag"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                />
                <button
                  onClick={addExpense}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold whitespace-nowrap"
                >
                  <Plus className="w-5 h-5" />
                  Voeg Toe
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {expenses.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nog geen uitgaven. Voeg hierboven je eerste uitgave toe.</p>
                </div>
              ) : (
                expenses.map(expense => (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-800">{expense.name}</p>
                      <p className="text-sm text-gray-500">€{expense.amount.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Verwijder uitgave"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
