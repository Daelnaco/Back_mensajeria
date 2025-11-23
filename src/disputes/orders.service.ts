import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export type OrderDisputeContext = {
  orderId: string;
  itemOrderId: string;
  buyerId: string;
  sellerId: string;
  status: string;
  itemStatus: string;
};

@Injectable()
export class OrdersService {
  constructor(private readonly http: HttpService) {}

  async validateOrderForDispute(
    buyerId: string,
    orderId: string,
    itemOrderId: string,
  ): Promise<OrderDisputeContext> {
    if (process.env.ORDERS_API_URL) {
      try {
        const res = await firstValueFrom(
          this.http.get(`${process.env.ORDERS_API_URL}/orders/${orderId}`),
        );
        const order = res.data;
        if (!order) {
          throw new NotFoundException('Orden no encontrada');
        }
        if (order.buyerId !== buyerId) {
          throw new BadRequestException('La orden no pertenece al comprador');
        }
        const item =
          order.items?.find((i) => i.itemOrderId === itemOrderId) ??
          order.items?.find((i) => i.id === itemOrderId);
        if (!item) {
          throw new NotFoundException('Item de la orden no encontrado');
        }
        if (!this.isEligibleStatus(item.status ?? order.status)) {
          throw new BadRequestException(
            'La orden aun no esta en estado para disputa',
          );
        }
        return {
          orderId,
          itemOrderId,
          buyerId,
          sellerId: item.sellerId ?? order.sellerId,
          status: order.status,
          itemStatus: item.status ?? order.status,
        };
      } catch (err) {
        if (err instanceof BadRequestException || err instanceof NotFoundException) {
          throw err;
        }
        throw new BadRequestException('No se pudo validar la orden');
      }
    }

    // Stub temporal
    return {
      orderId,
      itemOrderId,
      buyerId,
      sellerId: `seller-${itemOrderId}`,
      status: 'entregado',
      itemStatus: 'entregado',
    };
  }

  isEligibleStatus(status?: string) {
    const normalized = (status ?? '').toLowerCase();
    return ['enviado', 'entregado', 'shipped', 'delivered'].includes(normalized);
  }
}
