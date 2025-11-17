import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";


export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return new Response("Missing fields", { status: 400 });
  }

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return new Response("User already exists", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, password: hashedPassword, role: "USER" },
  });

  return new Response("User created", { status: 201 });
}
