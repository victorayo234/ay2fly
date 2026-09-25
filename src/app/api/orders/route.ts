import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser, verifyAdmin } from "@/lib/auth/server-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, userEmail, items, shippingAddress, deliveryMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.name) {
      return NextResponse.json(
        { error: "Valid shipping address is required." },
        { status: 400 }
      );
    }

    // Call server database order creation with strict stock revalidation and inventory decrement
    const result = await db.createOrder({
      userId: userId || "guest-user",
      userEmail: userEmail || "guest@ay2fly.com",
      items,
      shippingAddress,
      deliveryMethod: deliveryMethod || "standard",
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to create order." },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const orderNumber = searchParams.get("orderNumber");

  if (orderNumber) {
    const order = await db.getOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  }

  const currentUser = await getAuthenticatedUser();

  if (userId) {
    // If requesting specific user's orders, verify that the caller is that user or an admin
    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication required to view orders." },
        { status: 401 }
      );
    }

    if (currentUser.id !== userId) {
      const adminCheck = await verifyAdmin();
      if (!adminCheck.authorized) {
        return NextResponse.json(
          { error: "Access denied. You can only view your own orders." },
          { status: 403 }
        );
      }
    }

    const orders = await db.getOrdersByUser(userId);
    return NextResponse.json(orders);
  }

  // Requesting all orders requires administrative privileges
  const adminCheck = await verifyAdmin();
  if (!adminCheck.authorized) {
    return NextResponse.json(
      { error: adminCheck.error || "Administrative privileges required." },
      { status: adminCheck.status || 403 }
    );
  }

  const allOrders = await db.getAllOrders();
  return NextResponse.json(allOrders);
}

export async function PATCH(request: Request) {
  // Only admins can update order status
  const adminCheck = await verifyAdmin();
  if (!adminCheck.authorized) {
    return NextResponse.json(
      { error: adminCheck.error || "Administrative privileges required to update orders." },
      { status: adminCheck.status || 403 }
    );
  }

  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "orderId and status are required." },
        { status: 400 }
      );
    }

    const success = await db.updateOrderStatus(orderId, status);
    if (!success) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
