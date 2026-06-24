import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { DataFetcherService } from './data-fetcher.service';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true },
  namespace: '/prices',
})
export class PricesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private readonly logger = new Logger(PricesGateway.name);
  private interval: ReturnType<typeof setInterval> | null = null;
  private clients = 0;

  // Index into historical candles for the pseudo-real-time stream
  private streamIndex = 0;

  constructor(private fetcher: DataFetcherService) {}

  handleConnection() {
    this.clients++;
    this.logger.verbose(`Client connected (${this.clients} total)`);
    if (this.clients === 1) this.startStream();
  }

  handleDisconnect() {
    this.clients = Math.max(0, this.clients - 1);
    this.logger.verbose(`Client disconnected (${this.clients} remaining)`);
    if (this.clients === 0) this.stopStream();
  }

  /** Client requests the initial candle history */
  @SubscribeMessage('getCandles')
  handleGetCandles(client: Socket, payload: { count?: number }) {
    const candles = this.fetcher.getCandles(payload?.count ?? 300);
    client.emit('candles', candles);

    // Position stream cursor just after the data we sent
    this.streamIndex = this.fetcher.getAllCandles().length - 1;
  }

  // ── Private ──────────────────────────────────────────────────

  private startStream() {
    const all = this.fetcher.getAllCandles();
    this.streamIndex = Math.max(0, all.length - 1);

    // Emit one candle every 3 seconds (simulated H1 in fast-forward)
    // AND the real current price from Yahoo Finance (refreshed every 30s)
    this.interval = setInterval(() => {
      this.emitNextTick();
    }, 3_000);
  }

  private stopStream() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private emitNextTick() {
    const all = this.fetcher.getAllCandles();
    if (all.length === 0) return;

    // Use the real current price from Yahoo Finance as the close
    const realPrice = this.fetcher.getCurrentPrice();

    // Build a realistic synthetic tick around the real price
    const prev  = all[Math.max(0, this.streamIndex - 1)];
    const open  = prev?.close ?? realPrice;
    const noise = (Math.random() - 0.5) * 1.2;
    const close = +(realPrice + noise).toFixed(2);
    const high  = +(Math.max(open, close) + Math.random() * 0.8).toFixed(2);
    const low   = +(Math.min(open, close) - Math.random() * 0.8).toFixed(2);

    const tick = { timestamp: Date.now(), price: close, open, high, low, close };
    this.server.emit('tick', tick);

    this.streamIndex++;
    if (this.streamIndex >= all.length) this.streamIndex = 0;
  }
}
