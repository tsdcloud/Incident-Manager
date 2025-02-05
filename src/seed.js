// import express from 'express';
import xlsx from 'xlsx';
import { PrismaClient } from '@prisma/client';
import { generateRefNum } from './utils/utils.js';
const prisma = new PrismaClient();
// const app = express();

// Path to your Excel file
const excelFilePath = 'C:/Users/EVERMATE/Downloads/ID EQUIPEMENT.xlsx';

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
        const lastIncidentType = await prisma.equipement.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { numRef: true }
        });
      // Map Excel columns to your Prisma model fields
      const date = new Date();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        const prefix = `${mm}${yy}`;
        const nextNum = lastIncidentType ? parseInt(lastIncidentType.numRef.slice(-4)) + 1 : 1;
        const numRef = generateRefNum(lastIncidentType)

      const incidentType = {
        name: row['DESIGNATION'],
        numRef,
        createdBy:"user 1"
      };

      console.log(incidentType);

      // Insert data into the database
      await prisma.equipement
      // .create({
      //   data: incidentType,
      // });
      .upsert({
        where: {
          name: incidentType.name,
        },
        update: {
          name: incidentType.name,
        },
        create: {name:incidentType.name, numRef, createdBy:"user 1"},
    })
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