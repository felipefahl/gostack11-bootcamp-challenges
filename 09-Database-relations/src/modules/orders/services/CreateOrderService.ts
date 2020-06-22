import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Product from '@modules/products/infra/typeorm/entities/Product';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer invalid');
    }

    const foundProducts = await this.productsRepository.findAllById(products);

    if (foundProducts.length !== products.length) {
      throw new AppError('Product invalid');
    }

    const orderProducts = foundProducts.map(foundProduct => {
      const orderProduct =
        products.find(product => product.id === foundProduct.id) ||
        ({} as IProduct);

      if (orderProduct.quantity > foundProduct.quantity) {
        throw new AppError('Invalid product quantity');
      }

      return {
        orderProduct: {
          product_id: orderProduct.id,
          price: foundProduct.price,
          quantity: orderProduct.quantity,
        },
        updateProduct: {
          id: foundProduct.id,
          quantity: foundProduct.quantity - orderProduct.quantity,
        },
      };
    });

    const order = await this.ordersRepository.create({
      customer,
      products: orderProducts.map(orderProduct => orderProduct.orderProduct),
    });

    await this.productsRepository.updateQuantity(
      orderProducts.map(orderProduct => orderProduct.updateProduct),
    );

    return order;
  }
}

export default CreateOrderService;
