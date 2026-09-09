import { PrismaClient, ProductStatus, Role } from "@prisma/client";
import bcrypt from "bcrypt";

import { generateSlug } from "../src/shared/helpers/slug";

const prisma = new PrismaClient();

function placeholderImage(text: string, bg = "0A2A66", fg = "FFFFFF") {
  return `https://placehold.co/800x800/${bg}/${fg}/png?text=${encodeURIComponent(text)}`;
}

const CATEGORIES = [
  {
    name: "Electronics",
    description: "Everyday electronics and personal gadgets.",
  },
  {
    name: "Computers",
    description: "Laptops, desktops, monitors, and accessories.",
  },
  {
    name: "Networking",
    description: "Routers, switches, and access points for home and office.",
  },
  {
    name: "Security",
    description: "CCTV cameras, video doorbells, and surveillance kits.",
  },
  {
    name: "Home Appliances",
    description: "Air conditioners, washing machines, and kitchen appliances.",
  },
  {
    name: "Power Solutions",
    description: "UPS units and solar inverters for reliable backup power.",
  },
];

const BRANDS = [
  { name: "TP-Link", websiteUrl: "https://www.tp-link.com" },
  { name: "Dell", websiteUrl: "https://www.dell.com" },
  { name: "HP", websiteUrl: "https://www.hp.com" },
  { name: "Logitech", websiteUrl: "https://www.logitech.com" },
  { name: "Ubiquiti", websiteUrl: "https://www.ui.com" },
];

interface ProductSeed {
  category: string;
  brand?: string;
  sku: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  status: ProductStatus;
  isFeatured: boolean;
}

const PRODUCTS: ProductSeed[] = [
  {
    category: "Electronics",
    brand: "Logitech",
    sku: "ELEC-001",
    name: "Logitech MX Master 3S Wireless Mouse",
    shortDescription: "Ergonomic wireless mouse with quiet clicks.",
    description:
      "A precision wireless mouse with an 8K DPI sensor, quiet clicks, and up to 70 days of battery life on a single charge.",
    price: 8500,
    stockQuantity: 40,
    status: ProductStatus.ACTIVE,
    isFeatured: true,
  },
  {
    category: "Electronics",
    sku: "ELEC-002",
    name: "4K Ultra HD Smart LED TV 55-inch",
    shortDescription: "Cinematic 4K viewing with built-in smart apps.",
    description:
      "Enjoy vivid 4K Ultra HD picture quality with HDR support and a full suite of built-in streaming apps.",
    price: 45000,
    salePrice: 39900,
    stockQuantity: 15,
    status: ProductStatus.ACTIVE,
    isFeatured: true,
  },
  {
    category: "Electronics",
    sku: "ELEC-003",
    name: "Bluetooth Noise Cancelling Headphones",
    shortDescription: "Over-ear headphones with active noise cancellation.",
    description:
      "Immerse yourself in your music with active noise cancellation, 30-hour battery life, and a comfortable over-ear fit.",
    price: 6500,
    stockQuantity: 60,
    status: ProductStatus.ACTIVE,
    isFeatured: false,
  },
  {
    category: "Computers",
    brand: "Dell",
    sku: "COMP-001",
    name: "Dell Inspiron 15 Laptop (i5, 8GB, 512GB SSD)",
    shortDescription: "Reliable everyday laptop for work and study.",
    description:
      "Powered by an 11th Gen Intel Core i5 processor, 8GB RAM, and a fast 512GB SSD for smooth day-to-day computing.",
    price: 68000,
    stockQuantity: 20,
    status: ProductStatus.ACTIVE,
    isFeatured: true,
  },
  {
    category: "Computers",
    brand: "HP",
    sku: "COMP-002",
    name: "HP Pavilion Gaming Desktop",
    shortDescription: "Dedicated graphics for smooth gaming performance.",
    description:
      "A gaming-ready desktop with dedicated graphics, plenty of storage, and effective thermal management for long sessions.",
    price: 95000,
    salePrice: 89999,
    stockQuantity: 10,
    status: ProductStatus.ACTIVE,
    isFeatured: false,
  },
  {
    category: "Computers",
    brand: "Logitech",
    sku: "COMP-003",
    name: "Logitech K380 Wireless Keyboard",
    shortDescription: "Compact multi-device Bluetooth keyboard.",
    description:
      "Switch between up to three devices with the press of a button. Compact, quiet, and built for all-day typing.",
    price: 2800,
    stockQuantity: 75,
    status: ProductStatus.ACTIVE,
    isFeatured: false,
  },
  {
    category: "Computers",
    brand: "Dell",
    sku: "COMP-004",
    name: "Dell 24-inch FHD Monitor",
    shortDescription: "Crisp Full HD display for home or office.",
    description:
      "A 24-inch Full HD monitor with slim bezels and an ergonomic stand, ideal for productivity and everyday use.",
    price: 15500,
    stockQuantity: 25,
    status: ProductStatus.ACTIVE,
    isFeatured: false,
  },
  {
    category: "Networking",
    brand: "TP-Link",
    sku: "NET-001",
    name: "TP-Link Archer AX55 Wi-Fi 6 Router",
    shortDescription: "Next-gen Wi-Fi 6 speeds for the whole home.",
    description:
      "Dual-band Wi-Fi 6 router delivering faster speeds, wider coverage, and support for more connected devices.",
    price: 9800,
    stockQuantity: 35,
    status: ProductStatus.ACTIVE,
    isFeatured: true,
  },
  {
    category: "Networking",
    brand: "Ubiquiti",
    sku: "NET-002",
    name: "Ubiquiti UniFi 8-Port PoE Switch",
    shortDescription: "Managed PoE switch for growing networks.",
    description:
      "An 8-port managed switch with PoE support, built for reliable performance in small business networks.",
    price: 22000,
    stockQuantity: 18,
    status: ProductStatus.ACTIVE,
    isFeatured: false,
  },
  {
    category: "Networking",
    brand: "TP-Link",
    sku: "NET-003",
    name: "TP-Link 24-Port Gigabit Switch",
    shortDescription: "High-capacity unmanaged gigabit switch.",
    description:
      "A 24-port unmanaged gigabit switch built for stable, high-throughput wired networks.",
    price: 18500,
    stockQuantity: 0,
    status: ProductStatus.OUT_OF_STOCK,
    isFeatured: false,
  },
  {
    category: "Networking",
    brand: "Ubiquiti",
    sku: "NET-004",
    name: "Ubiquiti AC Pro Access Point",
    shortDescription: "High-performance dual-band access point.",
    description:
      "Enterprise-grade dual-band access point delivering strong, reliable Wi-Fi coverage for demanding environments.",
    price: 14500,
    stockQuantity: 22,
    status: ProductStatus.ACTIVE,
    isFeatured: true,
  },
  {
    category: "Security",
    sku: "SEC-001",
    name: "4-Channel CCTV Camera Kit with NVR",
    shortDescription: "Complete surveillance kit, ready to install.",
    description:
      "A complete 4-channel surveillance kit including cameras, NVR, and cabling, designed for easy home or shop installation.",
    price: 32000,
    salePrice: 27999,
    stockQuantity: 12,
    status: ProductStatus.ACTIVE,
    isFeatured: true,
  },
  {
    category: "Security",
    sku: "SEC-002",
    name: "Smart WiFi Video Doorbell",
    shortDescription: "See and speak to visitors from anywhere.",
    description:
      "HD video doorbell with motion alerts, two-way audio, and night vision, controllable from your phone.",
    price: 7200,
    stockQuantity: 30,
    status: ProductStatus.ACTIVE,
    isFeatured: false,
  },
  {
    category: "Security",
    brand: "Ubiquiti",
    sku: "SEC-003",
    name: "Ubiquiti G4 Pro Security Camera",
    shortDescription: "4K security camera with AI-based detection.",
    description:
      "A 4K resolution security camera with built-in AI person/vehicle detection and integrated LED spotlight.",
    price: 26500,
    stockQuantity: 14,
    status: ProductStatus.ACTIVE,
    isFeatured: false,
  },
  {
    category: "Home Appliances",
    sku: "HOME-001",
    name: "Inverter Split Air Conditioner 1.5 Ton",
    shortDescription: "Energy-efficient cooling for medium rooms.",
    description:
      "Inverter technology delivers efficient cooling with lower electricity bills and quiet operation.",
    price: 58000,
    stockQuantity: 16,
    status: ProductStatus.ACTIVE,
    isFeatured: true,
  },
  {
    category: "Home Appliances",
    sku: "HOME-002",
    name: "Automatic Washing Machine 8kg",
    shortDescription: "Fully automatic top-load washing machine.",
    description:
      "An 8kg fully automatic washing machine with multiple wash programs for everyday laundry needs.",
    price: 42000,
    stockQuantity: 0,
    status: ProductStatus.OUT_OF_STOCK,
    isFeatured: false,
  },
  {
    category: "Home Appliances",
    sku: "HOME-003",
    name: "Digital Air Fryer 5L",
    shortDescription: "Healthier frying with little to no oil.",
    description:
      "A 5-liter digital air fryer with preset cooking modes for healthier meals with little to no oil.",
    price: 8900,
    salePrice: 6900,
    stockQuantity: 45,
    status: ProductStatus.ACTIVE,
    isFeatured: false,
  },
  {
    category: "Power Solutions",
    sku: "PWR-001",
    name: "Offline UPS 650VA",
    shortDescription: "Basic backup power for home electronics.",
    description:
      "A compact 650VA offline UPS providing short backup power to protect essential home electronics.",
    price: 4200,
    stockQuantity: 50,
    status: ProductStatus.ACTIVE,
    isFeatured: false,
  },
  {
    category: "Power Solutions",
    sku: "PWR-002",
    name: "Online UPS 2000VA for Server",
    shortDescription: "Pure sine wave backup for sensitive equipment.",
    description:
      "A 2000VA online double-conversion UPS delivering pure sine wave output, ideal for servers and networking gear.",
    price: 35000,
    stockQuantity: 8,
    status: ProductStatus.ACTIVE,
    isFeatured: true,
  },
  {
    category: "Power Solutions",
    sku: "PWR-003",
    name: "Solar Inverter 5kVA Hybrid",
    shortDescription: "Hybrid solar inverter for home and business.",
    description:
      "A 5kVA hybrid solar inverter that combines solar, battery, and grid power for reliable, cost-effective energy.",
    price: 125000,
    stockQuantity: 6,
    status: ProductStatus.ACTIVE,
    isFeatured: false,
  },
];

const DEMO_USERS = [
  {
    email: "customer1@example.com",
    firstName: "Ayesha",
    lastName: "Rahman",
  },
  {
    email: "customer2@example.com",
    firstName: "Tanvir",
    lastName: "Hasan",
  },
];

const DEMO_PASSWORD = "password123";

const ADMIN_USERS = [
  {
    email: "superadmin@mbinternational.com",
    firstName: "Super",
    lastName: "Admin",
    role: Role.SUPER_ADMIN,
  },
  {
    email: "admin@mbinternational.com",
    firstName: "Store",
    lastName: "Admin",
    role: Role.ADMIN,
  },
];

const REVIEW_TEMPLATES: {
  sku: string;
  rating: number;
  title: string;
  comment: string;
}[] = [
  {
    sku: "ELEC-001",
    rating: 5,
    title: "Excellent mouse",
    comment: "Smooth tracking and the battery genuinely lasts for weeks.",
  },
  {
    sku: "ELEC-001",
    rating: 4,
    title: "Great but pricey",
    comment: "Works beautifully, just wish it was a bit cheaper.",
  },
  {
    sku: "ELEC-002",
    rating: 5,
    title: "Fantastic picture quality",
    comment: "The 4K picture is stunning and setup was painless.",
  },
  {
    sku: "COMP-001",
    rating: 4,
    title: "Solid everyday laptop",
    comment: "Handles browsing and office work without any lag.",
  },
  {
    sku: "NET-001",
    rating: 5,
    title: "Huge Wi-Fi improvement",
    comment: "Covers our whole house now, no more dead spots.",
  },
  {
    sku: "NET-004",
    rating: 4,
    title: "Reliable access point",
    comment: "Been running for weeks without a single drop.",
  },
  {
    sku: "SEC-001",
    rating: 5,
    title: "Easy to install",
    comment: "Set the whole kit up myself in an afternoon. Clear footage.",
  },
  {
    sku: "SEC-001",
    rating: 3,
    title: "Good value",
    comment: "Night vision could be a bit sharper, but great for the price.",
  },
  {
    sku: "HOME-001",
    rating: 5,
    title: "Cools fast, runs quiet",
    comment: "Very happy with the electricity savings so far.",
  },
  {
    sku: "PWR-002",
    rating: 5,
    title: "Keeps our server room safe",
    comment: "Clean power output, handled a full outage without issue.",
  },
];

async function seedCategories() {
  const categoryIds = new Map<string, string>();

  for (const category of CATEGORIES) {
    const slug = generateSlug(category.name);

    const record = await prisma.category.upsert({
      where: { slug },
      update: {
        description: category.description,
        imageUrl: placeholderImage(category.name),
      },
      create: {
        name: category.name,
        slug,
        description: category.description,
        imageUrl: placeholderImage(category.name),
      },
    });

    categoryIds.set(category.name, record.id);
  }

  return categoryIds;
}

async function seedBrands() {
  const brandIds = new Map<string, string>();

  for (const brand of BRANDS) {
    const slug = generateSlug(brand.name);

    const record = await prisma.brand.upsert({
      where: { slug },
      update: {
        websiteUrl: brand.websiteUrl,
        logoUrl: placeholderImage(brand.name, "C9962C", "0A2A66"),
      },
      create: {
        name: brand.name,
        slug,
        websiteUrl: brand.websiteUrl,
        logoUrl: placeholderImage(brand.name, "C9962C", "0A2A66"),
      },
    });

    brandIds.set(brand.name, record.id);
  }

  return brandIds;
}

async function seedProducts(
  categoryIds: Map<string, string>,
  brandIds: Map<string, string>
) {
  const productIds = new Map<string, string>();

  for (const product of PRODUCTS) {
    const slug = generateSlug(product.name);
    const categoryId = categoryIds.get(product.category);

    if (!categoryId) {
      throw new Error(`Unknown category: ${product.category}`);
    }

    const brandId = product.brand
      ? brandIds.get(product.brand)
      : undefined;

    const record = await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        name: product.name,
        slug,
        categoryId,
        brandId,
        shortDescription: product.shortDescription,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice,
        stockQuantity: product.stockQuantity,
        status: product.status,
        isFeatured: product.isFeatured,
      },
      create: {
        sku: product.sku,
        name: product.name,
        slug,
        categoryId,
        brandId,
        shortDescription: product.shortDescription,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice,
        stockQuantity: product.stockQuantity,
        status: product.status,
        isFeatured: product.isFeatured,
      },
    });

    productIds.set(product.sku, record.id);

    const existingImages = await prisma.productImage.count({
      where: { productId: record.id },
    });

    if (existingImages === 0) {
      await prisma.productImage.createMany({
        data: [
          {
            productId: record.id,
            imageUrl: placeholderImage(product.name),
            isPrimary: true,
            sortOrder: 0,
          },
          {
            productId: record.id,
            imageUrl: placeholderImage(`${product.name} 2`),
            isPrimary: false,
            sortOrder: 1,
          },
        ],
      });
    }
  }

  return productIds;
}

async function seedUsers() {
  const userIds = new Map<string, string>();
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  for (const user of DEMO_USERS) {
    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: hashedPassword,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    userIds.set(user.email, record.id);
  }

  for (const admin of ADMIN_USERS) {
    const record = await prisma.user.upsert({
      where: { email: admin.email },
      update: { role: admin.role },
      create: {
        email: admin.email,
        password: hashedPassword,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
      },
    });

    userIds.set(admin.email, record.id);
  }

  return userIds;
}

async function seedReviews(
  productIds: Map<string, string>,
  userIds: Map<string, string>
) {
  const emails = DEMO_USERS.map((user) => user.email);
  const touchedProductIds = new Set<string>();

  for (let index = 0; index < REVIEW_TEMPLATES.length; index++) {
    const template = REVIEW_TEMPLATES[index];
    const productId = productIds.get(template.sku);
    const userId = userIds.get(emails[index % emails.length]);

    if (!productId || !userId) continue;

    touchedProductIds.add(productId);

    await prisma.review.upsert({
      where: {
        productId_userId: { productId, userId },
      },
      update: {
        rating: template.rating,
        title: template.title,
        comment: template.comment,
      },
      create: {
        productId,
        userId,
        rating: template.rating,
        title: template.title,
        comment: template.comment,
      },
    });
  }

  for (const productId of touchedProductIds) {
    const aggregate = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: aggregate._avg.rating ?? 0,
        reviewCount: aggregate._count.rating,
      },
    });
  }
}

async function main() {
  console.log("Seeding categories...");
  const categoryIds = await seedCategories();

  console.log("Seeding brands...");
  const brandIds = await seedBrands();

  console.log("Seeding products...");
  const productIds = await seedProducts(categoryIds, brandIds);

  console.log("Seeding demo users...");
  const userIds = await seedUsers();

  console.log("Seeding reviews...");
  await seedReviews(productIds, userIds);

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
