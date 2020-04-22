import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
	"title": string,
  "value": number,
  "type": 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomes = this.transactions.filter(transaction => transaction.type === 'income').reduce((sum, x) => sum + x.value, 0);
    const outcomes = this.transactions.filter(transaction => transaction.type === 'outcome').reduce((sum, x) => sum + x.value, 0);
    return <Balance>{
      income: incomes,
      outcome: outcomes,
      total: (incomes - outcomes)
    };
  }

  public create({title, type, value} : CreateTransactionDTO): Transaction {
    const transaction = new Transaction({title, type, value} );
		this.transactions.push(transaction);

		return transaction;
  }
}

export default TransactionsRepository;
