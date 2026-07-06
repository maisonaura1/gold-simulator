export type BookRole   = 'OWNER' | 'TRADER' | 'VIEWER' | 'AUDITOR';
export type DeskSide   = 'BUY' | 'SELL';
export type DeskStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface TradeOrder {
  id:              string;
  bookId:          string;
  symbol:          string;
  side:            DeskSide;
  quantity:        number;
  price:           number;
  status:          DeskStatus;
  creatorEmail:    string;
  approvedByEmail: string | null;
  notes:           string | null;
  createdAt:       string;
  updatedAt:       string;
}

export interface Membership {
  bookId:   string;
  bookName: string;
  role:     BookRole;
  joinedAt: string;
}

export interface DeskOverview {
  currentUserEmail: string;
  membershipCount:  number;
  memberships:      Membership[];
  orderSummary:     Record<DeskStatus, number>;
  recentOrders:     TradeOrder[];
  findings:         string[];
}

export interface CreateOrderPayload {
  bookId:    string;
  symbol?:   string;
  side:      DeskSide;
  quantity:  number;
  price:     number;
  notes?:    string;
}

export interface ReviewOrderPayload {
  action: 'APPROVE' | 'REJECT';
  notes?: string;
}
