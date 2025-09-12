"use server";

import { headers } from "next/headers";
import { auth } from "./auth";

export async function getUserId() {
  const incomingHeaders = headers();

  const converted = new Headers();
  (await incomingHeaders).forEach((value, key) => {
    converted.append(key, value);
  });

  const session = await auth.api.getSession({
    headers: converted,
  });

  return session?.user?.id ?? null;
}
