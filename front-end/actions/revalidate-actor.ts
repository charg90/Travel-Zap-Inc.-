"use server";
import { revalidateTag } from "next/cache";

export async function revalidateActors() {
  revalidateTag("actors");
}
