const roundAmount = (value) => Number(value.toFixed(2));

const minimizeTransactions = (balances = {}) => {
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([name, balance]) => {
    const amount = Number(balance) || 0;

    if (amount > 0) {
      creditors.push({ name, amount });
    }

    if (amount < 0) {
      debtors.push({ name, amount: Math.abs(amount) });
    }
  });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];
    const amount = roundAmount(Math.min(creditor.amount, debtor.amount));

    if (amount > 0) {
      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount,
      });
    }

    creditor.amount = roundAmount(creditor.amount - amount);
    debtor.amount = roundAmount(debtor.amount - amount);

    if (creditor.amount === 0) {
      creditorIndex += 1;
    }

    if (debtor.amount === 0) {
      debtorIndex += 1;
    }
  }

  return transactions;
};

export { minimizeTransactions };
