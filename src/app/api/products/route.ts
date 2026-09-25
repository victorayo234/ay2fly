import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth/server-auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;
  const category = searchParams.get("category") || undefined;
  const collection = searchParams.get("collection") || undefined;
  const fit = searchParams.get("fit") || undefined;
  const size = searchParams.get("size") || undefined;
  const color = searchParams.get("color") || undefined;
  const sort = (searchParams.get("sort") as any) || undefined;
  const inStockOnly = searchParams.get("inStockOnly") === "true";
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;

  const products = await db.getProducts({
    search,
    category,
    collection,
    fit,
    size,
    color,
    sort,
    inStockOnly,
    minPrice,
    maxPrice,
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  // Server-side database verification of admin role
  const adminCheck = await verifyAdmin();
  if (!adminCheck.authorized) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const body = await request.json();
    const {
      name,
      category_id,
      collection_id,
      price,
      sale_price,
      material,
      fit,
      description,
      variants,
      images,
    } = body;

    if (!name || !category_id || price === undefined) {
      return NextResponse.json(
        { error: "Product name, category, and price are required." },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newProduct = await db.createProduct({
      name,
      slug,
      description: description || "Engineered architectural streetwear piece.",
      category_id,
      collection_id: collection_id || null,
      price: Number(price),
      sale_price: sale_price ? Number(sale_price) : null,
      material: material || "100% Heavyweight Cotton",
      fit: fit || "oversized",
      status: body.status || "active",
      images: images || [],
      variants: variants || [],
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create product in database." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  // Server-side database verification of admin role
  const adminCheck = await verifyAdmin();
  if (!adminCheck.authorized) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const body = await request.json();
    const { variantId, stock, productId, updates } = body;

    if (variantId && stock !== undefined) {
      const success = await db.updateVariantStock(variantId, Number(stock));
      if (!success) {
        return NextResponse.json({ error: "Variant not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, variantId, stock });
    }

    if (productId && updates) {
      const updatedProduct = await db.updateProduct(productId, updates);
      if (!updatedProduct) {
        return NextResponse.json({ error: "Product not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, product: updatedProduct });
    }

    return NextResponse.json(
      { error: "Invalid patch payload. Provide variantId & stock, or productId & updates." },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
