// import express from 'express';
import xlsx from 'xlsx';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// const app = express();

// Path to your Excel file
const excelFilePath = 'C:/Users/EVERMATE/Downloads/Type INCIDENTS.xlsx';

// Function to read and parse the Excel file
function readExcelFile(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet); // Convert sheet to JSON
}

// Function to seed the database
async function seedDatabase() {
  try {
    const data = readExcelFile(excelFilePath);

    for (const row of data) {
        const lastIncidentType = await prisma.incidentType.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { numRef: true }
        });
      // Map Excel columns to your Prisma model fields
      const date = new Date();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        const prefix = `${mm}${yy}`;
        const nextNum = lastIncidentType ? parseInt(lastIncidentType.numRef.slice(-4)) + 1 : 1;
        const numRef = `${prefix}${String(nextNum).padStart(4, '0')}`;

      const incidentType = {
        name: row['DESIGNATION'],
        numRef,
        createdBy:"user1"
      };

      // Insert data into the database
      await prisma.incidentType.create({
        data: incidentType,
      });
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding script
seedDatabase();

// Start the Express server (optional)
// app.listen(3000, () => {
//   console.log('Server is running on http://localhost:3000');
// });