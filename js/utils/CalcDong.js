
class Payer {
    constructor(name, quantity, payment) {
      this.name = name;
      this.quantity = quantity;
      this.payment = payment;
    }
  }
  
  class Transaction {
    constructor(name, amount) {
      this.name = name;
      this.amount = amount;
    }
  }
  
  class PaymentResult {
    constructor(payer, receiver, amount) {
      this.payer = payer;
      this.receiver = receiver;
      this.amount = amount;
    }
  }
  
  function calculateBalances(payers) {
    // Validate input
    if (!Array.isArray(payers) || payers.length === 0) {
      throw new Error('Payers list must be a non-empty array');
    }
  
    // Calculate totals
    const totalPaid = payers.reduce((sum, payer) => sum + payer.payment, 0);
    const totalPeople = payers.reduce((sum, payer) => sum + payer.quantity, 0);
    
    if (totalPeople === 0) {
      throw new Error('Total quantity of people cannot be zero');
    }
  
    const perPersonShare = totalPaid / totalPeople;
  
    // Categorize debtors and creditors
    const debtors = [];
    const creditors = [];
  
    payers.forEach(payer => {
      const expectedPayment = perPersonShare * payer.quantity;
      const balance = payer.payment - expectedPayment;
  
      if (balance < 0) {
        debtors.push(new Transaction(payer.name, Math.abs(balance)));
      } else if (balance > 0) {
        creditors.push(new Transaction(payer.name, balance));
      }
      // Zero balance is ignored
    });
  
    return { debtors, creditors };
  }
  
  export function CalcDong(_payers) {
    // Input validation
      const payers = [];
      for(let i = 0 ; i < _payers.length; i++)
      {
        payers.push( new Payer(_payers[i].name, _payers[i].qty , _payers[i].pay));  
      }

  
    if (!payers.every(p => p instanceof Payer)) {
      throw new TypeError('All payers must be instances of Payer class');
    }
  
    // Process balances
    const { debtors, creditors } = calculateBalances(payers);
    
    // Sort by amount (highest first)
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);
  
    const transactions = [];
    let debtorIndex = 0;
    let creditorIndex = 0;
  
    // Match debtors with creditors
    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
      const debtor = debtors[debtorIndex];
      const creditor = creditors[creditorIndex];
      const amount = Math.min(debtor.amount, creditor.amount);
  
      if (amount > 0) {
        transactions.push(new PaymentResult(
          debtor.name,
          creditor.name,
          amount
        ));
  
        // Reduce remaining amounts
        debtor.amount -= amount;
        creditor.amount -= amount;
  
        // Move to next debtor/creditor if current one is settled
        if (Math.abs(debtor.amount) < 0.01) debtorIndex++;
        if (Math.abs(creditor.amount) < 0.01) creditorIndex++;
      }
    }
  
    return transactions;
  }
  
  // Example usage:
  // const payers = [
  //   new Payer('Alice', 2, 300),
  //   new Payer('Bob', 1, 100),
  //   new Payer('Charlie', 3, 200)
  // ];
  // 
  // const paymentPlan = calculatePayments(payers);
  // console.log(paymentPlan);