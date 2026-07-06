import { api } from './api';
import type {
  DeskOverview, TradeOrder,
  CreateOrderPayload, ReviewOrderPayload,
} from '@/types/trade-desk';

export const tradeDeskApi = {
  getOverview: () =>
    api.get<DeskOverview>('/trade-desk/overview').then((r) => r.data),

  listOrders: (bookId?: string) =>
    api.get<TradeOrder[]>('/trade-desk/orders', { params: bookId ? { bookId } : {} }).then((r) => r.data),

  createOrder: (payload: CreateOrderPayload) =>
    api.post<TradeOrder>('/trade-desk/orders', payload).then((r) => r.data),

  submitOrder: (id: string) =>
    api.patch<TradeOrder>(`/trade-desk/orders/${id}/submit`).then((r) => r.data),

  reviewOrder: (id: string, payload: ReviewOrderPayload) =>
    api.patch<TradeOrder>(`/trade-desk/orders/${id}/review`, payload).then((r) => r.data),
};
