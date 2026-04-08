const roundAmount = (value) => Number(value.toFixed(2));

const calculateNetBalances = (expenses = []) => {
  return expenses.reduce((balances, expense) => {
    const amount = Number(expense.amount) || 0;
    const splitAmount = Number(expense.splitAmount) || 0;
    const paidBy = expense.paidBy;
    const participants = Array.isArray(expense.participants)
      ? expense.participants
      : [];

    if (paidBy) {
      balances[paidBy] = roundAmount((balances[paidBy] || 0) + amount);
    }

    participants.forEach((participant) => {
      if (!participant) {
        return;
      }

      balances[participant] = roundAmount(
        (balances[participant] || 0) - splitAmount,
      );
    });

    return balances;
  }, {});
};

export { calculateNetBalances };
