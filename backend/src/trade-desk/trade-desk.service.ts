import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ReviewOrderDto } from './dto/review-order.dto';
import { BookRole, DeskStatus } from '@prisma/client';

const VALID_SYMBOLS = new Set(['XAUUSD', 'GOLD', 'XAU']);
const OWNER_TRADER: BookRole[] = ['OWNER', 'TRADER'];
const OWNER_AUDITOR: BookRole[] = ['OWNER', 'AUDITOR'];

function normalizeSymbol(raw?: string): string {
  const s = (raw ?? 'XAUUSD').toUpperCase().trim();
  if (!VALID_SYMBOLS.has(s)) throw new BadRequestException(`Symbol "${raw}" is not supported. Only XAUUSD / gold spot is allowed.`);
  return 'XAUUSD';
}

@Injectable()
export class TradeDeskService {
  constructor(private prisma: PrismaService) {}

  // ─── helpers ─────────────────────────────────────────────────────────

  private async getMembership(bookId: string, userEmail: string) {
    return this.prisma.tradeBookMember.findUnique({
      where: { bookId_userEmail: { bookId, userEmail } },
    });
  }

  private async requireMembership(bookId: string, userEmail: string) {
    const m = await this.getMembership(bookId, userEmail);
    if (!m) throw new ForbiddenException('Access denied: you are not a member of this book.');
    return m;
  }

  private requireRole(role: BookRole, allowed: BookRole[], label: string) {
    if (!allowed.includes(role))
      throw new ForbiddenException(`Access denied: "${label}" requires role ${allowed.join(' or ')}.`);
  }

  private async getAccessibleOrder(orderId: string, userEmail: string) {
    const order = await this.prisma.tradeOrder.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found.');
    await this.requireMembership(order.bookId, userEmail);
    return order;
  }

  private async writeAudit(bookId: string, orderId: string | null, actorEmail: string, action: string, detail?: string) {
    await this.prisma.tradeAuditLog.create({
      data: { bookId, orderId, actorEmail, action, detail },
    });
  }

  // ─── getAuditOverview ────────────────────────────────────────────────

  async getAuditOverview(userEmail: string) {
    const memberships = await this.prisma.tradeBookMember.findMany({
      where: { userEmail },
      include: { book: true },
    });

    const bookIds = memberships.map((m) => m.bookId);

    const [orderSummaryRaw, recentOrders] = await Promise.all([
      this.prisma.tradeOrder.groupBy({
        by: ['status'],
        where: { bookId: { in: bookIds } },
        _count: true,
      }),
      this.prisma.tradeOrder.findMany({
        where: { bookId: { in: bookIds } },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true, bookId: true, symbol: true, side: true,
          quantity: true, price: true, status: true,
          creatorEmail: true, approvedByEmail: true,
          notes: true, createdAt: true, updatedAt: true,
        },
      }),
    ]);

    const orderSummary: Record<string, number> = {};
    for (const row of orderSummaryRaw) {
      orderSummary[row.status] = row._count;
    }

    // Integrity findings
    const findings: string[] = [];

    const approvedWithoutApprover = await this.prisma.tradeOrder.count({
      where: { bookId: { in: bookIds }, status: 'APPROVED', approvedByEmail: null },
    });
    if (approvedWithoutApprover > 0)
      findings.push(`${approvedWithoutApprover} APPROVED order(s) missing approver attribution.`);

    const selfApproved = await this.prisma.tradeOrder.count({
      where: { bookId: { in: bookIds }, status: 'APPROVED', AND: [{ approvedByEmail: { not: null } }] },
    });
    // Check self-approval via raw query
    const selfApprovalRows = await this.prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM trade_orders
      WHERE book_id = ANY(${bookIds}::text[])
        AND status = 'APPROVED'
        AND approved_by_email = creator_email
    `;
    const selfApprovalCount = Number(selfApprovalRows[0]?.count ?? 0);
    if (selfApprovalCount > 0)
      findings.push(`${selfApprovalCount} order(s) were self-approved (creator = approver). Requires review.`);

    const nonXauusd = await this.prisma.tradeOrder.count({
      where: { bookId: { in: bookIds }, NOT: { symbol: 'XAUUSD' } },
    });
    if (nonXauusd > 0)
      findings.push(`${nonXauusd} order(s) with non-XAUUSD symbol detected.`);

    return {
      currentUserEmail: userEmail,
      membershipCount: memberships.length,
      memberships: memberships.map((m) => ({
        bookId: m.bookId,
        bookName: m.book.name,
        role: m.role,
        joinedAt: m.joinedAt,
      })),
      orderSummary,
      recentOrders,
      findings,
    };
  }

  // ─── listOrders ──────────────────────────────────────────────────────

  async listOrders(userEmail: string, bookId?: string) {
    const memberships = await this.prisma.tradeBookMember.findMany({ where: { userEmail } });
    const accessibleBookIds = memberships.map((m) => m.bookId);

    if (bookId && !accessibleBookIds.includes(bookId))
      throw new ForbiddenException('Access denied: book not accessible.');

    return this.prisma.tradeOrder.findMany({
      where: { bookId: bookId ? bookId : { in: accessibleBookIds } },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true, bookId: true, symbol: true, side: true,
        quantity: true, price: true, status: true,
        creatorEmail: true, approvedByEmail: true,
        notes: true, createdAt: true, updatedAt: true,
      },
    });
  }

  // ─── createOrder ────────────────────────────────────────────────────

  async createOrder(userEmail: string, dto: CreateOrderDto) {
    const symbol = normalizeSymbol(dto.symbol);
    const membership = await this.requireMembership(dto.bookId, userEmail);
    this.requireRole(membership.role, OWNER_TRADER, 'createOrder');

    if (dto.quantity <= 0) throw new BadRequestException('Quantity must be positive.');
    if (dto.price <= 0)    throw new BadRequestException('Price must be positive.');

    const order = await this.prisma.tradeOrder.create({
      data: {
        bookId: dto.bookId,
        symbol,
        side: dto.side,
        quantity: dto.quantity,
        price: dto.price,
        status: 'DRAFT',
        creatorEmail: userEmail,
        notes: dto.notes,
      },
    });

    await this.writeAudit(
      dto.bookId, order.id, userEmail,
      'ORDER_CREATED',
      `DRAFT ${dto.side} ${dto.quantity} oz @ ${dto.price}`,
    );

    return order;
  }

  // ─── submitOrder ────────────────────────────────────────────────────

  async submitOrder(userEmail: string, orderId: string) {
    const order = await this.getAccessibleOrder(orderId, userEmail);

    if (order.status !== 'DRAFT')
      throw new BadRequestException(`Cannot submit: order is ${order.status}, expected DRAFT.`);

    const membership = await this.getMembership(order.bookId, userEmail);
    const isCreator  = order.creatorEmail === userEmail;
    const isOwner    = membership?.role === 'OWNER';

    if (!isCreator && !isOwner)
      throw new ForbiddenException('Only the order creator or a book OWNER can submit this order.');

    const updated = await this.prisma.tradeOrder.update({
      where: { id: orderId },
      data: { status: 'SUBMITTED' },
    });

    await this.writeAudit(order.bookId, orderId, userEmail, 'ORDER_SUBMITTED', 'DRAFT → SUBMITTED');
    return updated;
  }

  // ─── reviewOrder ────────────────────────────────────────────────────

  async reviewOrder(userEmail: string, orderId: string, dto: ReviewOrderDto) {
    const order = await this.getAccessibleOrder(orderId, userEmail);

    if (order.status !== 'SUBMITTED')
      throw new BadRequestException(`Cannot review: order is ${order.status}, expected SUBMITTED.`);

    const membership = await this.requireMembership(order.bookId, userEmail);
    this.requireRole(membership.role, OWNER_AUDITOR, 'reviewOrder');

    if (order.creatorEmail === userEmail)
      throw new ForbiddenException('Self-approval is not permitted. The reviewer must differ from the order creator.');

    const newStatus: DeskStatus = dto.action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    const data: Record<string, unknown> = { status: newStatus };
    if (newStatus === 'APPROVED') data.approvedByEmail = userEmail;

    const updated = await this.prisma.tradeOrder.update({ where: { id: orderId }, data });

    await this.writeAudit(
      order.bookId, orderId, userEmail,
      newStatus === 'APPROVED' ? 'ORDER_APPROVED' : 'ORDER_REJECTED',
      `SUBMITTED → ${newStatus}${dto.notes ? ': ' + dto.notes : ''}`,
    );

    return updated;
  }
}
