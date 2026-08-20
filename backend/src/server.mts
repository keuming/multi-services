if (!process.env.VERCEL) {
  try {
    await import("dotenv/config");
  } catch {
    // dotenv not installed / not resolvable — env vars assumed set another way.
  }
}

await import("./app.js");
