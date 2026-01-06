const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";


async function handleResponse(res: Response) {
  let data;

  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      "Something went wrong. Please try again."
    );
  }

  return data;
}

export async function fetchNewProducts() {
  const res = await fetch(`${BASE_URL}/api/new-products/`, {
    cache: "no-store",
  });

  return handleResponse(res);
}

export async function verifyUser(phone_number: string) {
    const res = await fetch(`${BASE_URL}/api/verify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number }),
    });

    return res.json();
}

export async function registerUser(data: { name: string; phone_number: string; unique_id?: string }) {
    const res = await fetch(`${BASE_URL}/api/login-register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    return handleResponse(res);
}

export async function purchaseProduct({
    product_id,
    variation_product_id,
    token,
}: {
    product_id?: string;
    variation_product_id?: string;
    token: string;
}) {
    const res = await fetch(`${BASE_URL}/api/purchase-product/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            product_id,
            variation_product_id,
        }),
    });

    return handleResponse(res);
}

export async function fetchUserOrders(token: string) {
    const res = await fetch(`${BASE_URL}/api/user-orders/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(res);
}
