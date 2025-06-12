import { contactUs } from "@/drizzle/schema";
import { db } from "../db";

export async function saveContactMessage(name: string, email: string, message: string) {
    const result = await db.insert(contactUs).values({
        name: name,
        email: email,
        message: message,
    });
    console.log("saveContactMessage Result Variable: ", result)
    return !!(result && ('insertId' in result ? result.insertId : true));
}