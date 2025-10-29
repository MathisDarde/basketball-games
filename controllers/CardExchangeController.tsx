import { db } from "@/db";
import { card_exchange, marketExchangeStatus } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function getExchangeById(id: string) {
  try {
    const result = await db
      .select()
      .from(card_exchange)
      .where(eq(card_exchange.id, id))
      .limit(1);

    return result[0] || null;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la récupération de l'échange.");
  }
}

export async function getAllExchanges() {
  try {
    const result = await db.select().from(card_exchange);
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la récupération des échanges.");
  }
}

export async function createExchange(data: {
  userId: string;
  receivedCardId: string;
  givenCardsId: string;
}) {
  try {
    const { userId, receivedCardId, givenCardsId } = data;

    if (!userId || !receivedCardId || !givenCardsId) {
      throw new Error("Données manquantes pour la création de l'échange.");
    }

    const newExchange = {
      id: uuidv4(),
      userId,
      receivedCardId,
      givenCardsId,
      status: "pending" as const,
    };

    await db.insert(card_exchange).values(newExchange);

    return newExchange;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la création de l'échange.");
  }
}

export async function updateExchangeStatus(id: string, status: "pending" | "validated") {
  try {
    if (!marketExchangeStatus.enumValues.includes(status)) {
      throw new Error(`Statut invalide : ${status}`);
    }

    const result = await db
      .update(card_exchange)
      .set({ status })
      .where(eq(card_exchange.id, id));

    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la mise à jour du statut de l'échange.");
  }
}

export async function deleteExchange(id: string) {
  try {
    const result = await db.delete(card_exchange).where(eq(card_exchange.id, id));
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la suppression de l'échange.");
  }
}
