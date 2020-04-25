import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const balance = (await this.find()).reduce(
      (prevBalance, { type, value }) => {
        const nextBalance = prevBalance;
        if (type === 'income') {
          nextBalance.income += Number(value);
        }
        if (type === 'outcome') {
          nextBalance.outcome += Number(value);
        }
        nextBalance.total = nextBalance.income - nextBalance.outcome;
        return nextBalance;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      } as Balance,
    );
    return balance;
  }
}

export default TransactionsRepository;
