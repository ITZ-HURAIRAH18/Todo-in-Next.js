import { defineConfig } from "prisma/config";

const supabaseDirectUrl =
  "postgresql://postgres.ergfhfaktunqnwyttebt:fLfXx6Ff-iX$wce@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: supabaseDirectUrl,
  },
});
