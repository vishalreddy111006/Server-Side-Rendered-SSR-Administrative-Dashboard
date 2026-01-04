import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // --- 1. SETUP ADMIN ---
  const password = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password,
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`👤 Admin configured: ${user.email}`);

  // --- 2. SETUP CATEGORIES ---
  const categories = [
    { name: 'Electronics' },
    { name: 'Clothing' },
    { name: 'Books' },
    { name: 'Home & Garden' },
  ];

  // Using upsert loop to prevent "Unique constraint" errors if you run seed twice
  for (const cat of categories) {
    // Check if exists first to avoid duplicates (simple check)
    const existing = await prisma.category.findFirst({ where: { name: cat.name } });
    if (!existing) {
      await prisma.category.create({ data: cat });
    }
  }
  console.log('📦 Categories configured');

  // --- 3. GENERATE FAKE ORDERS (NEW) ---
  const users = await prisma.user.findMany();
  const products = await prisma.product.findMany();

  if (users.length === 0 || products.length === 0) {
    console.log("⚠️ Skipping Order generation: You need at least 1 User and 1 Product.");
    return;
  }

  console.log("🛒 Generating 20 fake orders...");
  
  for (let i = 0; i < 20; i++) {
    // Pick a random user
    const randomUser = users[Math.floor(Math.random() * users.length)];
    
    // Pick 1-3 random products
    const randomProducts = products
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);

    // Calculate total price
    const total = randomProducts.reduce((sum, p) => sum + p.price, 0);

    // Create the Order
    await prisma.order.create({
      data: {
        userId: randomUser.id,
        // Random Status
        status: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"][Math.floor(Math.random() * 4)],
        total: total,
        // Random Date (within last 3 months)
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 7776000000)), 
        items: {
          create: randomProducts.map((p) => ({
            productId: p.id,
            name: p.name,
            price: p.price,
            quantity: 1,
          })),
        },
      },
    });
  }
  console.log("✅ 20 Orders generated successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });