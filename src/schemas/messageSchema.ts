import { z } from "zod";

export const messagesSchema = z.object({
  content: z
    .string()
    .min(10, { message: "message must be atleast 10 characters" })
    .max(300, { message: "message must not longer than 300 characters" }),
});
