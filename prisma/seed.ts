import { config } from "dotenv"
config({ path: ".env" })

import { PrismaClient } from "../lib/generated/prisma"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding PPS Hub database...")

  // Clear existing data
  await prisma.fieldReport.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.maintenanceVisit.deleteMany()
  await prisma.maintenancePlan.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.repairRequest.deleteMany()
  await prisma.rentalRequest.deleteMany()
  await prisma.article.deleteMany()
  await prisma.generator.deleteMany()
  await prisma.sparePart.deleteMany()
  await prisma.user.deleteMany()

  const password = await bcrypt.hash("demo1234", 10)

  // ─── STAFF ────────────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      name: "Ejiro Udu",
      email: "admin@pps.ng",
      password,
      role: "ADMIN",
      phone: "07038581722",
      address: "No 12 Da Silva Street, Lekki Phase 1, Lagos",
    },
  })

  const cs1 = await prisma.user.create({
    data: {
      name: "Tunde Adeyemi",
      email: "support@pps.ng",
      password,
      role: "CUSTOMER_SERVICE",
      phone: "08156234781",
      address: "14 Admiralty Way, Lekki Phase 1, Lagos",
    },
  })

  const cs2 = await prisma.user.create({
    data: {
      name: "Amaka Okonkwo",
      email: "support2@pps.ng",
      password,
      role: "CUSTOMER_SERVICE",
      phone: "09023415678",
      address: "22 Ogunsanwo Street, Surulere, Lagos",
    },
  })

  const eng1 = await prisma.user.create({
    data: {
      name: "Emeka Nwosu",
      email: "tech@pps.ng",
      password,
      role: "ENGINEER",
      phone: "08034562891",
      address: "5 Adeleke Street, Ikeja, Lagos",
    },
  })

  const eng2 = await prisma.user.create({
    data: {
      name: "Seun Olatunji",
      email: "tech2@pps.ng",
      password,
      role: "ENGINEER",
      phone: "07011234567",
      address: "33 Agege Motor Road, Ogba, Lagos",
    },
  })

  // ─── CUSTOMERS ────────────────────────────────────────────────────────────
  const customers = await Promise.all([
    prisma.user.create({ data: { name: "Chidi Okafor", email: "customer@pps.ng", password, role: "CUSTOMER", phone: "08123456789", address: "15 Kofo Abayomi Street, Victoria Island, Lagos" } }),
    prisma.user.create({ data: { name: "Funke Adeleke", email: "funke@example.ng", password, role: "CUSTOMER", phone: "09034567890", address: "7 Bourdillon Road, Ikoyi, Lagos" } }),
    prisma.user.create({ data: { name: "Babatunde Salami", email: "btunde@example.ng", password, role: "CUSTOMER", phone: "08067891234", address: "44 Bode Thomas Street, Surulere, Lagos" } }),
    prisma.user.create({ data: { name: "Ngozi Eze", email: "ngozi@example.ng", password, role: "CUSTOMER", phone: "07098765432", address: "11 Opebi Road, Ikeja, Lagos" } }),
    prisma.user.create({ data: { name: "Musa Ibrahim", email: "musa@example.ng", password, role: "CUSTOMER", phone: "08156789012", address: "3 Emmanuel Keshi Street, Magodo, Lagos" } }),
    prisma.user.create({ data: { name: "Adaeze Nwachukwu", email: "adaeze@example.ng", password, role: "CUSTOMER", phone: "09123456789", address: "25 Lekki-Epe Expressway, Ajah, Lagos" } }),
    prisma.user.create({ data: { name: "Olumide Fashola", email: "olumide@example.ng", password, role: "CUSTOMER", phone: "08045678901", address: "8 Aromire Avenue, Ikeja GRA, Lagos" } }),
    prisma.user.create({ data: { name: "Yetunde Afolabi", email: "yetunde@example.ng", password, role: "CUSTOMER", phone: "07056789012", address: "19 Ologun Agbaje Street, Victoria Island, Lagos" } }),
    prisma.user.create({ data: { name: "Kelechi Onyekachi", email: "kelechi@example.ng", password, role: "CUSTOMER", phone: "08167890123", address: "6 Adewale Kolawole Crescent, Lekki Phase 1, Lagos" } }),
    prisma.user.create({ data: { name: "Abimbola Dada", email: "abimbola@example.ng", password, role: "CUSTOMER", phone: "09078901234", address: "31 Gbagada Expressway, Gbagada, Lagos" } }),
  ])

  const [chidi, funke, babatunde, ngozi, musa, adaeze, olumide, yetunde, kelechi, abimbola] = customers

  // ─── GENERATORS ───────────────────────────────────────────────────────────
  const gen20_1 = await prisma.generator.create({ data: { brand: "Perkins", model: "P20-S", kvaCapacity: 20, serialNumber: "PER-2024-001", status: "AVAILABLE", fuelType: "Diesel", location: "PPS Yard, Lekki", acquisitionDate: new Date("2022-03-15"), notes: "Good condition, recently serviced" } })
  const gen20_2 = await prisma.generator.create({ data: { brand: "Lister", model: "LPW2", kvaCapacity: 20, serialNumber: "LIS-2024-002", status: "RENTED", fuelType: "Diesel", location: "Victoria Island", acquisitionDate: new Date("2021-06-20") } })
  const gen20_3 = await prisma.generator.create({ data: { brand: "FG Wilson", model: "P20-1", kvaCapacity: 20, serialNumber: "FGW-2024-003", status: "AVAILABLE", fuelType: "Diesel", location: "PPS Yard, Lekki", acquisitionDate: new Date("2022-11-10") } })
  const gen60_1 = await prisma.generator.create({ data: { brand: "Caterpillar", model: "C3.4B", kvaCapacity: 60, serialNumber: "CAT-2024-004", status: "AVAILABLE", fuelType: "Diesel", location: "PPS Yard, Lekki", acquisitionDate: new Date("2020-08-05") } })
  const gen60_2 = await prisma.generator.create({ data: { brand: "Cummins", model: "C60 D5e", kvaCapacity: 60, serialNumber: "CUM-2024-005", status: "RENTED", fuelType: "Diesel", location: "Ikeja", acquisitionDate: new Date("2021-02-18") } })
  const gen60_3 = await prisma.generator.create({ data: { brand: "Perkins", model: "60 HKW", kvaCapacity: 60, serialNumber: "PER-2024-006", status: "AVAILABLE", fuelType: "Diesel", location: "PPS Yard, Lekki", acquisitionDate: new Date("2022-05-25") } })
  const gen100_1 = await prisma.generator.create({ data: { brand: "Caterpillar", model: "C9", kvaCapacity: 100, serialNumber: "CAT-2024-007", status: "AVAILABLE", fuelType: "Diesel", location: "PPS Yard, Lekki", acquisitionDate: new Date("2019-12-12") } })
  const gen100_2 = await prisma.generator.create({ data: { brand: "FG Wilson", model: "P110-1", kvaCapacity: 100, serialNumber: "FGW-2024-008", status: "RENTED", fuelType: "Diesel", location: "Lekki Phase 2", acquisitionDate: new Date("2020-04-30") } })
  const gen100_3 = await prisma.generator.create({ data: { brand: "Cummins", model: "C100 D5e", kvaCapacity: 100, serialNumber: "CUM-2024-009", status: "MAINTENANCE", fuelType: "Diesel", location: "PPS Workshop", acquisitionDate: new Date("2021-09-14"), notes: "Undergoing scheduled maintenance - AVR replacement" } })
  const gen200_1 = await prisma.generator.create({ data: { brand: "Caterpillar", model: "C15", kvaCapacity: 200, serialNumber: "CAT-2024-010", status: "AVAILABLE", fuelType: "Diesel", location: "PPS Yard, Lekki", acquisitionDate: new Date("2020-01-20") } })
  const gen200_2 = await prisma.generator.create({ data: { brand: "Cummins", model: "C200 D5e", kvaCapacity: 200, serialNumber: "CUM-2024-011", status: "RENTED", fuelType: "Diesel", location: "Ajah", acquisitionDate: new Date("2019-07-08") } })
  const gen200_3 = await prisma.generator.create({ data: { brand: "Perkins", model: "200 kVA", kvaCapacity: 200, serialNumber: "PER-2024-012", status: "AVAILABLE", fuelType: "Diesel", location: "PPS Yard, Lekki", acquisitionDate: new Date("2021-11-22") } })
  const gen350_1 = await prisma.generator.create({ data: { brand: "Caterpillar", model: "C18", kvaCapacity: 350, serialNumber: "CAT-2024-013", status: "AVAILABLE", fuelType: "Diesel", location: "PPS Yard, Lekki", acquisitionDate: new Date("2018-05-15") } })
  const gen350_2 = await prisma.generator.create({ data: { brand: "FG Wilson", model: "P350-1", kvaCapacity: 350, serialNumber: "FGW-2024-014", status: "RENTED", fuelType: "Diesel", location: "Victoria Island", acquisitionDate: new Date("2019-03-10") } })
  const gen500 = await prisma.generator.create({ data: { brand: "Caterpillar", model: "C27", kvaCapacity: 500, serialNumber: "CAT-2024-015", status: "OUT_OF_SERVICE", fuelType: "Diesel", location: "PPS Yard, Lekki", acquisitionDate: new Date("2017-09-01"), notes: "Major overhaul in progress - ETA 2 weeks" } })

  // ─── SPARE PARTS ──────────────────────────────────────────────────────────
  const parts = await Promise.all([
    prisma.sparePart.create({ data: { name: "Caterpillar Oil Filter", category: "Filters", price: 12500, stockQuantity: 25, compatibility: "Caterpillar", description: "Genuine CAT oil filter for C9, C15, C18 engines", sku: "CAT-OF-001", reorderLevel: 5 } }),
    prisma.sparePart.create({ data: { name: "Cummins Oil Filter", category: "Filters", price: 8500, stockQuantity: 30, compatibility: "Cummins", description: "OEM Cummins oil filter compatible with C60, C100, C200 series", sku: "CUM-OF-001", reorderLevel: 5 } }),
    prisma.sparePart.create({ data: { name: "Universal Fuel Filter (Diesel)", category: "Filters", price: 5500, stockQuantity: 40, compatibility: "Universal", description: "High-quality diesel fuel filter compatible with most generator brands", sku: "UNI-FF-001", reorderLevel: 8 } }),
    prisma.sparePart.create({ data: { name: "Air Filter - Heavy Duty", category: "Filters", price: 9800, stockQuantity: 20, compatibility: "Caterpillar, Cummins, Perkins", description: "Heavy duty air filter for industrial generators 60KVA+", sku: "HD-AF-001", reorderLevel: 5 } }),
    prisma.sparePart.create({ data: { name: "12V Maintenance-Free Battery", category: "Batteries", price: 48000, stockQuantity: 15, compatibility: "Universal", description: "12V 100Ah maintenance-free lead acid battery for generator starting", sku: "BAT-12V-100", reorderLevel: 3 } }),
    prisma.sparePart.create({ data: { name: "24V Heavy Duty Battery", category: "Batteries", price: 95000, stockQuantity: 8, compatibility: "Large generators 200KVA+", description: "24V 200Ah heavy duty battery for large industrial generators", sku: "BAT-24V-200", reorderLevel: 2 } }),
    prisma.sparePart.create({ data: { name: "Stamford AVR (AS440)", category: "AVR Modules", price: 45000, stockQuantity: 12, compatibility: "Stamford alternators", description: "AS440 Automatic Voltage Regulator for Stamford alternators", sku: "AVR-AS440", reorderLevel: 3 } }),
    prisma.sparePart.create({ data: { name: "Leroy Somer AVR (R448)", category: "AVR Modules", price: 68000, stockQuantity: 7, compatibility: "Leroy Somer alternators", description: "R448 AVR for Leroy Somer LSA series alternators", sku: "AVR-R448", reorderLevel: 2 } }),
    prisma.sparePart.create({ data: { name: "DSE7320 Controller", category: "Control Panels", price: 125000, stockQuantity: 5, compatibility: "Universal", description: "Deep Sea Electronics 7320 AMF control module", sku: "DSE-7320", reorderLevel: 2 } }),
    prisma.sparePart.create({ data: { name: "ComAp InteliLite Controller", category: "Control Panels", price: 89000, stockQuantity: 6, compatibility: "Universal", description: "InteliLite 4 AMF automatic mains failure controller", sku: "COMP-IL4", reorderLevel: 2 } }),
    prisma.sparePart.create({ data: { name: "Starter Motor - 24V", category: "Starters", price: 75000, stockQuantity: 10, compatibility: "Caterpillar C9/C15", description: "24V heavy duty starter motor for CAT C9 and C15 engines", sku: "STR-24V-CAT", reorderLevel: 3 } }),
    prisma.sparePart.create({ data: { name: "Alternator Brushes Set", category: "Alternators", price: 15000, stockQuantity: 25, compatibility: "Stamford, Leroy Somer", description: "Carbon brush set for Stamford and Leroy Somer alternators", sku: "ALT-BRUSH-01", reorderLevel: 5 } }),
    prisma.sparePart.create({ data: { name: "Drive Belt Set", category: "Belts & Hoses", price: 18500, stockQuantity: 20, compatibility: "Universal", description: "Heavy duty drive belt set for most generator makes", sku: "BELT-DRV-01", reorderLevel: 5 } }),
    prisma.sparePart.create({ data: { name: "Radiator Coolant Hose", category: "Belts & Hoses", price: 12000, stockQuantity: 18, compatibility: "Caterpillar, Cummins", description: "Upper and lower radiator hoses for CAT and Cummins engines", sku: "HOSE-RAD-01", reorderLevel: 4 } }),
    prisma.sparePart.create({ data: { name: "Head Gasket Set - Cummins", category: "Gaskets & Seals", price: 35000, stockQuantity: 8, compatibility: "Cummins C60-C200", description: "Complete head gasket set for Cummins C60 to C200 series", sku: "GSK-CUM-HD", reorderLevel: 2 } }),
    prisma.sparePart.create({ data: { name: "Thermostat - Caterpillar", category: "Cooling System", price: 22000, stockQuantity: 15, compatibility: "Caterpillar", description: "Engine thermostat for CAT C9, C15, C18 generators", sku: "THERM-CAT-01", reorderLevel: 3 } }),
    prisma.sparePart.create({ data: { name: "Fuel Injector - Perkins", category: "Fuel System", price: 55000, stockQuantity: 10, compatibility: "Perkins 1000 series", description: "OEM fuel injector for Perkins 1004 and 1006 engines", sku: "INJ-PER-1000", reorderLevel: 3 } }),
    prisma.sparePart.create({ data: { name: "Glow Plugs Set (6pcs)", category: "Electrical", price: 28000, stockQuantity: 12, compatibility: "Universal diesel", description: "Set of 6 glow plugs for cold-start diesel generators", sku: "GLOW-SET-6", reorderLevel: 3 } }),
    prisma.sparePart.create({ data: { name: "Exhaust Flex Pipe", category: "Other", price: 35000, stockQuantity: 8, compatibility: "60-200KVA generators", description: "Flexible exhaust connector for vibration dampening on medium generators", sku: "EXH-FLEX-01", reorderLevel: 2 } }),
    prisma.sparePart.create({ data: { name: "Shell Rimula R4 Engine Oil (20L)", category: "Filters", price: 42000, stockQuantity: 30, compatibility: "Universal", description: "Shell Rimula R4 15W40 diesel engine oil - 20 litre drum", sku: "OIL-RIMULA-20L", reorderLevel: 5 } }),
  ])

  console.log("✅ Staff, customers, generators, and parts created")

  // ─── RENTAL REQUESTS ─────────────────────────────────────────────────────
  const rental1 = await prisma.rentalRequest.create({
    data: {
      customerId: chidi.id,
      generatorId: gen100_1.id,
      engineerId: eng1.id,
      kvaNeeded: 100,
      startDate: new Date("2025-03-05"),
      endDate: new Date("2025-03-08"),
      deliveryAddress: "15 Kofo Abayomi Street, Victoria Island, Lagos",
      deliveryLGA: "Victoria Island",
      eventType: "Wedding/Event",
      itemsToPower: "4 ACs, lighting rig, DJ setup, catering equipment",
      status: "ACTIVE",
      totalCost: 285000,
      depositPaid: true,
    },
  })

  const rental2 = await prisma.rentalRequest.create({
    data: {
      customerId: funke.id,
      generatorId: gen60_2.id,
      engineerId: eng2.id,
      kvaNeeded: 60,
      startDate: new Date("2025-02-28"),
      endDate: new Date("2025-04-28"),
      deliveryAddress: "7 Bourdillon Road, Ikoyi, Lagos",
      deliveryLGA: "Ikoyi",
      eventType: "Office/Commercial",
      status: "ACTIVE",
      totalCost: 2300000,
      depositPaid: true,
    },
  })

  const rental3 = await prisma.rentalRequest.create({
    data: {
      customerId: babatunde.id,
      kvaNeeded: 200,
      startDate: new Date("2025-03-10"),
      endDate: new Date("2025-03-25"),
      deliveryAddress: "44 Bode Thomas Street, Surulere, Lagos",
      deliveryLGA: "Surulere",
      eventType: "Construction Site",
      status: "CONFIRMED",
      totalCost: 1890000,
    },
  })

  const rental4 = await prisma.rentalRequest.create({
    data: {
      customerId: ngozi.id,
      generatorId: gen350_2.id,
      engineerId: eng1.id,
      kvaNeeded: 350,
      startDate: new Date("2025-01-15"),
      endDate: new Date("2025-03-15"),
      deliveryAddress: "11 Opebi Road, Ikeja, Lagos",
      deliveryLGA: "Ikeja",
      eventType: "Office/Commercial",
      status: "ACTIVE",
      totalCost: 8640000,
      depositPaid: true,
    },
  })

  const rental5 = await prisma.rentalRequest.create({
    data: {
      customerId: musa.id,
      kvaNeeded: 60,
      startDate: new Date("2025-03-01"),
      endDate: new Date("2025-03-04"),
      deliveryAddress: "3 Emmanuel Keshi Street, Magodo, Lagos",
      deliveryLGA: "Magodo",
      eventType: "Wedding/Event",
      status: "BOOKED",
      totalCost: 157000,
    },
  })

  const rental6 = await prisma.rentalRequest.create({
    data: {
      customerId: adaeze.id,
      generatorId: gen200_2.id,
      engineerId: eng2.id,
      kvaNeeded: 200,
      startDate: new Date("2025-02-01"),
      endDate: new Date("2025-03-01"),
      deliveryAddress: "25 Lekki-Epe Expressway, Ajah, Lagos",
      deliveryLGA: "Ajah",
      eventType: "Residential",
      status: "RETURNED",
      totalCost: 3735000,
      depositPaid: true,
    },
  })

  const rental7 = await prisma.rentalRequest.create({
    data: {
      customerId: olumide.id,
      kvaNeeded: 500,
      startDate: new Date("2025-03-20"),
      endDate: new Date("2025-06-20"),
      deliveryAddress: "8 Aromire Avenue, Ikeja GRA, Lagos",
      deliveryLGA: "Ikeja",
      eventType: "Manufacturing",
      status: "DISPATCHED",
      totalCost: 22680000,
    },
  })

  const rental8 = await prisma.rentalRequest.create({
    data: {
      customerId: yetunde.id,
      kvaNeeded: 30,
      startDate: new Date("2025-02-10"),
      endDate: new Date("2025-02-15"),
      deliveryAddress: "19 Ologun Agbaje Street, Victoria Island, Lagos",
      deliveryLGA: "Victoria Island",
      eventType: "Wedding/Event",
      status: "INSPECTED",
      totalCost: 180000,
      depositPaid: true,
    },
  })

  // ─── REPAIR REQUESTS ─────────────────────────────────────────────────────
  const repair1 = await prisma.repairRequest.create({
    data: {
      customerId: kelechi.id,
      engineerId: eng1.id,
      generatorBrand: "Caterpillar",
      generatorModel: "C15",
      problemDescription: "Generator starts but shuts down after 10-15 minutes of operation. Overheat warning light is on. Coolant level appears normal.",
      urgency: "URGENT",
      status: "IN_PROGRESS",
      location: "6 Adewale Kolawole Crescent, Lekki Phase 1, Lagos",
      diagnosisNotes: "Thermostat faulty, causing overheat. Radiator also partially clogged. Parts ordered.",
      estimatedCost: 185000,
      partsRequired: "Thermostat (CAT), Radiator flush kit",
    },
  })

  const repair2 = await prisma.repairRequest.create({
    data: {
      customerId: abimbola.id,
      engineerId: eng2.id,
      generatorBrand: "Cummins",
      generatorModel: "C100 D5e",
      problemDescription: "Low voltage output — getting 180V instead of 220V. AVR indicator light blinking red.",
      urgency: "STANDARD",
      status: "QUOTE_SENT",
      location: "31 Gbagada Expressway, Gbagada, Lagos",
      diagnosisNotes: "AVR (AS440) needs replacement. Brushes worn out too.",
      estimatedCost: 68000,
      partsRequired: "Stamford AVR AS440, Alternator Brush Set",
    },
  })

  const repair3 = await prisma.repairRequest.create({
    data: {
      customerId: babatunde.id,
      generatorBrand: "FG Wilson",
      generatorModel: "P20-1",
      problemDescription: "Generator won't start at all. Clicking sound when key is turned. Battery was recently replaced.",
      urgency: "EMERGENCY",
      status: "SUBMITTED",
      location: "44 Bode Thomas Street, Surulere, Lagos",
    },
  })

  const repair4 = await prisma.repairRequest.create({
    data: {
      customerId: funke.id,
      engineerId: eng1.id,
      generatorBrand: "Perkins",
      generatorModel: "P110",
      problemDescription: "Excessive black smoke from exhaust. Fuel consumption has increased significantly. Generator is rough running.",
      urgency: "STANDARD",
      status: "COMPLETED",
      location: "7 Bourdillon Road, Ikoyi, Lagos",
      diagnosisNotes: "Injectors clogged and one injector faulty. Air filter completely blocked. All replaced.",
      estimatedCost: 95000,
      finalCost: 98500,
    },
  })

  const repair5 = await prisma.repairRequest.create({
    data: {
      customerId: chidi.id,
      engineerId: eng2.id,
      generatorBrand: "Caterpillar",
      generatorModel: "C9",
      problemDescription: "Automatic transfer switch (ATS) not working — generator not coming on when PHCN goes off.",
      urgency: "URGENT",
      status: "PARTS_ORDERED",
      location: "15 Kofo Abayomi Street, Victoria Island, Lagos",
      diagnosisNotes: "ATS contactor burnt. New contactor ordered from supplier.",
      estimatedCost: 145000,
      partsRequired: "ATS contactor 100A",
    },
  })

  console.log("✅ Rentals and repairs created")

  // ─── ORDERS ──────────────────────────────────────────────────────────────
  const order1 = await prisma.order.create({
    data: {
      customerId: chidi.id,
      totalAmount: 61500,
      deliveryFee: 2500,
      deliveryOption: "standard",
      deliveryAddress: "15 Kofo Abayomi Street, Victoria Island, Lagos",
      status: "DELIVERED",
      items: {
        create: [
          { sparePartId: parts[0].id, quantity: 2, unitPrice: parts[0].price },
          { sparePartId: parts[12].id, quantity: 2, unitPrice: parts[12].price },
        ],
      },
    },
  })

  const order2 = await prisma.order.create({
    data: {
      customerId: funke.id,
      totalAmount: parts[6].price + parts[11].price + 5000,
      deliveryFee: 5000,
      deliveryOption: "express",
      deliveryAddress: "7 Bourdillon Road, Ikoyi, Lagos",
      status: "CONFIRMED",
      items: {
        create: [
          { sparePartId: parts[6].id, quantity: 1, unitPrice: parts[6].price },
          { sparePartId: parts[11].id, quantity: 1, unitPrice: parts[11].price },
        ],
      },
    },
  })

  const order3 = await prisma.order.create({
    data: {
      customerId: ngozi.id,
      totalAmount: parts[4].price + 2500,
      deliveryFee: 2500,
      deliveryOption: "standard",
      deliveryAddress: "11 Opebi Road, Ikeja, Lagos",
      status: "PROCESSING",
      items: {
        create: [{ sparePartId: parts[4].id, quantity: 1, unitPrice: parts[4].price }],
      },
    },
  })

  const order4 = await prisma.order.create({
    data: {
      customerId: musa.id,
      totalAmount: parts[1].price * 2 + parts[2].price + 2500,
      deliveryFee: 2500,
      deliveryOption: "standard",
      deliveryAddress: "3 Emmanuel Keshi Street, Magodo, Lagos",
      status: "PENDING",
      items: {
        create: [
          { sparePartId: parts[1].id, quantity: 2, unitPrice: parts[1].price },
          { sparePartId: parts[2].id, quantity: 1, unitPrice: parts[2].price },
        ],
      },
    },
  })

  // ─── MAINTENANCE PLANS ────────────────────────────────────────────────────
  const plan1 = await prisma.maintenancePlan.create({
    data: {
      customerId: funke.id,
      packageType: "PREMIUM",
      startDate: new Date("2024-09-01"),
      nextServiceDate: new Date("2025-04-01"),
      status: "ACTIVE",
      visits: {
        create: [
          {
            engineerId: eng1.id,
            generatorId: gen60_2.id,
            scheduledDate: new Date("2025-01-01"),
            completedDate: new Date("2025-01-02"),
            notes: "Full monthly service completed. Oil changed, filters replaced, load test passed. All systems nominal.",
          },
          {
            engineerId: eng1.id,
            generatorId: gen60_2.id,
            scheduledDate: new Date("2025-02-01"),
            completedDate: new Date("2025-02-03"),
            notes: "Monthly service. Minor coolant top-up needed. Control panel diagnostics all clear.",
          },
          {
            engineerId: eng2.id,
            generatorId: gen60_2.id,
            scheduledDate: new Date("2025-03-01"),
            completedDate: new Date("2025-03-02"),
            notes: "Monthly service. Belt tension adjusted. Fuel filter replaced ahead of schedule.",
          },
        ],
      },
    },
  })

  const plan2 = await prisma.maintenancePlan.create({
    data: {
      customerId: ngozi.id,
      packageType: "STANDARD",
      startDate: new Date("2024-10-15"),
      nextServiceDate: new Date("2025-04-15"),
      status: "ACTIVE",
      visits: {
        create: [
          {
            engineerId: eng2.id,
            generatorId: gen350_2.id,
            scheduledDate: new Date("2024-12-15"),
            completedDate: new Date("2024-12-17"),
            notes: "Bi-monthly service. Oil and filters changed. Load testing at 80% — within specs.",
          },
          {
            engineerId: eng2.id,
            generatorId: gen350_2.id,
            scheduledDate: new Date("2025-02-15"),
            completedDate: new Date("2025-02-17"),
            notes: "Bi-monthly service. All checks passed. Noted slight exhaust smoke — monitoring.",
          },
        ],
      },
    },
  })

  const plan3 = await prisma.maintenancePlan.create({
    data: {
      customerId: adaeze.id,
      packageType: "BASIC",
      startDate: new Date("2024-06-01"),
      nextServiceDate: new Date("2025-06-01"),
      status: "ACTIVE",
      visits: {
        create: [
          {
            engineerId: eng1.id,
            scheduledDate: new Date("2024-09-01"),
            completedDate: new Date("2024-09-03"),
            notes: "Quarterly basic service. Oil changed, air filter cleaned, battery terminals cleaned.",
          },
          {
            engineerId: eng1.id,
            scheduledDate: new Date("2024-12-01"),
            completedDate: new Date("2024-12-05"),
            notes: "Quarterly service. Fuel filter replaced. Load test — output stable.",
          },
          {
            engineerId: eng2.id,
            scheduledDate: new Date("2025-03-01"),
            notes: "Quarterly service scheduled — March 2025",
          },
        ],
      },
    },
  })

  // ─── ARTICLES ────────────────────────────────────────────────────────────
  await prisma.article.create({
    data: {
      title: "How to Choose the Right KVA for Your Event or Business",
      slug: "how-to-choose-right-kva",
      excerpt: "Selecting the correct generator size is crucial for reliable power. Too small and it overloads; too large and you waste fuel.",
      content: `Choosing the right generator size is one of the most important decisions when renting a generator. Here's your comprehensive guide.

UNDERSTANDING KVA AND KW
KVA (Kilovolt-Ampere) is the apparent power rating of a generator. KW (Kilowatt) is the actual working power. A generator rated at 100KVA typically delivers about 80KW of actual working power (at 0.8 power factor).

HOW TO CALCULATE YOUR POWER NEEDS

Step 1: List all appliances you need to power
- Air conditioners (1.5HP = ~1.5KW, 2HP = ~2KW)
- Lighting (LED 10W per bulb)
- Sound system (1-5KW depending on size)
- Refrigerators (150-400W each)
- Computers/TVs (100-500W each)

Step 2: Add up total wattage and add 25% safety margin

QUICK REFERENCE GUIDE
- Small home (3 bedrooms, 2 ACs): 30-40KVA
- Large home / small office: 60KVA
- Medium office / event: 100KVA
- Large event / mall: 200-350KVA
- Industrial / hospital: 500KVA+

TIPS FROM OUR ENGINEERS
Always factor in startup surge — motors can draw 3-6x rated power on startup. Consider future expansion. When in doubt, go one size bigger.

Need help calculating? Call PPS: 07038581722`,
      category: "Buyer's Guide",
      authorId: admin.id,
      published: true,
      publishedAt: new Date("2024-12-01"),
    },
  })

  await prisma.article.create({
    data: {
      title: "Generator Maintenance Schedule: What You Must Do Monthly",
      slug: "generator-maintenance-schedule-monthly",
      excerpt: "Regular maintenance extends your generator's life and prevents costly breakdowns. Here's what to check every month.",
      content: `Your generator is a significant investment. Regular maintenance protects that investment and ensures reliability when you need it most.

WEEKLY CHECKS (For generators running daily)
✓ Check oil level — maintain at correct mark
✓ Check coolant level — top up if needed
✓ Check fuel level and fuel lines for leaks
✓ Test run for at least 30 minutes under load
✓ Check for unusual noises or vibrations

MONTHLY MAINTENANCE
✓ Change engine oil and filter
✓ Inspect air filter — clean or replace
✓ Check battery condition and terminals
✓ Inspect belts for wear and tension
✓ Check all electrical connections
✓ Test automatic transfer switch (ATS)
✓ Load test at 50% and 75% capacity

EVERY 3 MONTHS
✓ Replace fuel filter
✓ Check coolant antifreeze concentration
✓ Inspect exhaust system
✓ Check all bolts and fasteners
✓ Inspect AVR and control panel

EVERY 6 MONTHS
✓ Full diagnostic scan
✓ Radiator cleaning
✓ Fuel tank inspection and drain
✓ Injector service (diesel engines)

WARNING SIGNS TO WATCH FOR
- Black or white smoke from exhaust
- Unusual engine noise or vibration
- Voltage fluctuation or low output
- Excessive fuel consumption
- Engine overheating

PPS offers monthly, bi-monthly, and quarterly maintenance plans to keep your generator in peak condition. Contact us at info@premiumpower.org`,
      category: "Maintenance",
      authorId: eng1.id,
      published: true,
      publishedAt: new Date("2025-01-10"),
    },
  })

  await prisma.article.create({
    data: {
      title: "Generator Safety: 10 Rules You Must Never Break",
      slug: "generator-safety-rules",
      excerpt: "Generator accidents cause deaths and fires every year in Nigeria. Follow these non-negotiable safety rules.",
      content: `Generator safety is not optional — it's a matter of life and death. PPS engineers share the 10 safety rules we enforce on every site.

1. NEVER RUN INDOORS OR IN ENCLOSED SPACES
Carbon monoxide (CO) from generator exhaust is odorless, colorless, and deadly. Always operate generators outdoors with at least 3 meters of clearance from any building opening.

2. NEVER REFUEL A RUNNING GENERATOR
Always shut down and allow to cool before refueling. Fuel on hot engine components causes immediate fire.

3. USE PROPER EARTHING/GROUNDING
Always ground your generator to prevent electrocution. PPS engineers install proper earth stakes on every deployment.

4. INSTALL ATS (AUTOMATIC TRANSFER SWITCH)
A proper ATS prevents back-feeding electricity into PHCN lines, which has killed linesmen. Never manually switch between generator and mains without an ATS.

5. KEEP FIRE EXTINGUISHER NEARBY
A CO2 or ABC dry powder extinguisher should be within reach of any generator installation.

6. NEVER OVERLOAD THE GENERATOR
Operating above rated capacity causes overheating, reduced lifespan, and fire risk. Calculate your load and stay within 80% of rated capacity.

7. REGULAR MAINTENANCE IS NOT OPTIONAL
An unmaintained generator is a fire and safety hazard. Oil leaks, worn belts, and faulty electrical components cause accidents.

8. KEEP CHILDREN AND PETS AWAY
Generator rooms should be secured and inaccessible to children. Moving parts and live electricity are extremely dangerous.

9. USE CORRECT CABLES AND CONNECTIONS
Undersized cables cause fires. Never use extension cables as permanent wiring. Have a qualified electrician install your generator connections.

10. KNOW YOUR EMERGENCY SHUTDOWN
Every person in the building should know how to emergency-stop the generator. Practice this quarterly.

REPORT ALL FAULTS IMMEDIATELY
If you notice anything unusual — smell of burning, unusual noise, voltage fluctuation — shut down immediately and call PPS: 07038581722`,
      category: "Safety",
      authorId: admin.id,
      published: true,
      publishedAt: new Date("2025-01-20"),
    },
  })

  await prisma.article.create({
    data: {
      title: "Diesel vs Petrol Generators: Which is Right for You?",
      slug: "diesel-vs-petrol-generators",
      excerpt: "Choosing between diesel and petrol comes down to load size, usage duration, and total cost of ownership.",
      content: `The diesel vs petrol debate is common for anyone buying or renting a generator. Here's the definitive guide.

DIESEL GENERATORS
Advantages:
- More fuel efficient — up to 30% less fuel than equivalent petrol
- More durable — diesel engines last 2-3x longer
- Better for heavy, continuous loads
- Safer — diesel is less flammable than petrol
- Lower maintenance costs long-term

Disadvantages:
- Higher upfront cost
- Louder (though modern diesel gensets are much quieter)
- Diesel can gel in very cold weather (not relevant for Lagos)
- Higher initial purchase price

PETROL GENERATORS
Advantages:
- Cheaper to buy (especially smaller units)
- Lighter and more portable
- Easier to start
- Petrol more widely available at filling stations

Disadvantages:
- Higher fuel costs over time
- Less durable
- Not ideal for continuous operation
- More volatile/flammable

RECOMMENDATION
For most Lagos applications:
- Events (1-3 days): Diesel, 60KVA+ is more economical
- Home backup (occasional): Petrol 7-20KVA is fine
- Office/commercial (continuous): Always diesel
- Construction sites: Diesel

PPS rents only diesel generators for reliability. For purchases, we stock both types.

Contact us for a free consultation: 07038581722`,
      category: "Buyer's Guide",
      authorId: cs1.id,
      published: true,
      publishedAt: new Date("2025-02-05"),
    },
  })

  await prisma.article.create({
    data: {
      title: "What to Do When Your Generator Won't Start",
      slug: "generator-wont-start-troubleshooting",
      excerpt: "Follow this step-by-step troubleshooting guide before calling for a repair technician.",
      content: `Generator won't start? Don't panic. Work through this checklist systematically before calling a technician.

STEP 1: CHECK THE BASICS
□ Is there fuel in the tank? (Sounds obvious but it's the #1 call-out reason!)
□ Is the fuel valve/cock in the OPEN position?
□ Is the battery charged? (Check voltmeter — should read 12V+)
□ Is the choke in the correct position?
□ Is the oil level correct? (Low oil protection may prevent starting)

STEP 2: CHECK ELECTRICAL
□ Is the main breaker tripped? Reset and try again
□ Are battery terminals clean and tight?
□ Is the starter motor engaging? (Do you hear a click or grinding noise?)

STEP 3: COMMON PROBLEMS AND FIXES

Problem: Clicking sound but won't crank
Cause: Dead battery or bad connection
Fix: Jump start or replace battery; clean terminals

Problem: Cranks but won't fire
Cause: Fuel starvation or air in fuel line
Fix: Check fuel filter, bleed fuel line, check injectors

Problem: Starts then immediately stops
Cause: Low oil shutdown triggered, or governor fault
Fix: Check oil level; check governor linkage

Problem: Cranks, fires, runs rough then dies
Cause: Dirty fuel, clogged injectors, dirty air filter
Fix: Replace fuel filter; clean or replace air filter

Problem: No response at all
Cause: Battery completely dead or control board fault
Fix: Test battery; check fuses; inspect control board

WHEN TO CALL A TECHNICIAN
If you've checked all the above and the generator still won't start, call PPS immediately:
- Emergency: 07038581722
- Email: info@premiumpower.org

Do NOT attempt to disassemble injectors, fuel pumps, or control boards yourself — you risk voiding warranty and causing further damage.`,
      category: "Troubleshooting",
      authorId: eng2.id,
      published: true,
      publishedAt: new Date("2025-02-15"),
    },
  })

  // ─── NOTIFICATIONS ────────────────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      { userId: chidi.id, title: "Rental Confirmed", message: "Your 100KVA rental has been confirmed for March 5-8, 2025. Our engineer Emeka will be on-site.", type: "success" },
      { userId: chidi.id, title: "Engineer En Route", message: "Emeka Nwosu is on his way to your location. ETA: 45 minutes.", type: "info" },
      { userId: funke.id, title: "Maintenance Visit Completed", message: "Your March monthly maintenance visit has been completed. Report attached.", type: "success" },
      { userId: funke.id, title: "Repair Quote Ready", message: "Your repair quote for the Perkins generator is ready. Total: ₦98,500. Please approve.", type: "info" },
      { userId: admin.id, title: "Emergency Repair Request", message: "FG Wilson generator emergency request from Babatunde Salami — Surulere. Immediate dispatch required.", type: "error" },
      { userId: admin.id, title: "New Rental Booking", message: "New 500KVA rental booking from Olumide Fashola for Ikeja GRA. Confirm availability.", type: "info" },
      { userId: eng1.id, title: "New Job Assigned", message: "You have been assigned to the Caterpillar C15 overheating repair in Lekki Phase 1.", type: "info" },
      { userId: eng2.id, title: "Parts Ordered", message: "ATS contactor for Chidi Okafor's job has been ordered. Expected delivery tomorrow.", type: "info" },
    ],
  })

  // ─── MESSAGES ─────────────────────────────────────────────────────────────
  await prisma.message.createMany({
    data: [
      { senderId: chidi.id, receiverId: cs1.id, content: "Hello, I wanted to confirm my generator rental for next week's event. Is the 100KVA unit still available?", rentalId: rental1.id },
      { senderId: cs1.id, receiverId: chidi.id, content: "Hello Chidi! Yes, your 100KVA Caterpillar C9 is confirmed for March 5-8. Engineer Emeka Nwosu will be assigned to your event.", rentalId: rental1.id },
      { senderId: chidi.id, receiverId: cs1.id, content: "Great! Will the engineer arrive before the event starts? We need setup by 4pm on March 5.", rentalId: rental1.id },
      { senderId: cs1.id, receiverId: chidi.id, content: "Absolutely! Emeka will arrive by 12pm to allow 4 hours for setup, testing, and fuel top-up. You're in good hands!", rentalId: rental1.id },
      { senderId: kelechi.id, receiverId: cs2.id, content: "My generator started making a loud noise last night and keeps shutting off. This is urgent!", repairId: repair1.id },
      { senderId: cs2.id, receiverId: kelechi.id, content: "I'm sorry to hear that! I've escalated this as URGENT. Emeka will be at your location by 9am tomorrow. Please keep the generator off for now.", repairId: repair1.id },
    ],
  })

  // ─── FIELD REPORTS ────────────────────────────────────────────────────────
  await prisma.fieldReport.create({
    data: {
      engineerId: eng1.id,
      repairId: repair1.id,
      notes: "Arrived on-site at 9:15am. Found thermostat failed open causing coolant bypass. Radiator also has partial blockage — cleaned. New thermostat installed. Generator tested for 2 hours under load — temperature now stable at 85°C operating range. Advised customer to schedule next service in 3 months.",
      partsUsed: JSON.stringify(["Caterpillar Thermostat x1", "Radiator Flush Solution"]),
    },
  })

  await prisma.fieldReport.create({
    data: {
      engineerId: eng1.id,
      rentalId: rental1.id,
      notes: "Generator delivered and installed at venue. 30-meter cable run to main distribution board. ATS installed and tested — automatic switchover in 8 seconds. Load tested at 60% and 80% capacity — output stable at 220V. Customer briefed on operation. On-call during event.",
    },
  })

  console.log("✅ All seed data created successfully!")
  console.log("")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("🔑 DEMO LOGIN CREDENTIALS")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("👑 Admin:        admin@pps.ng / demo1234")
  console.log("📞 Customer Svc: support@pps.ng / demo1234")
  console.log("🔧 Engineer:     tech@pps.ng / demo1234")
  console.log("👤 Customer:     customer@pps.ng / demo1234")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
