import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { User } from '../src/models/User.js';
import { Resource } from '../src/models/Resource.js';

// Guard against accidental execution in production
if (env.isProduction) {
  console.error('[SAFETY ERROR] Seeding is strictly forbidden in production environment.');
  process.exit(1);
}

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to database:', env.MONGODB_URI);
    await mongoose.connect(env.MONGODB_URI);

    console.log('[Seed] Clearing existing development data...');
    await Promise.all([User.deleteMany({}), Resource.deleteMany({})]);

    console.log('[Seed] Creating demo student accounts...');
    const passwordHash = await User.hashPassword('student123');

    const [alex, maya, priya, jordan] = await User.create([
      {
        name: 'Alex Rivera',
        email: 'alex.rivera@campus.edu',
        passwordHash,
      },
      {
        name: 'Maya Chen',
        email: 'maya.chen@campus.edu',
        passwordHash,
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@campus.edu',
        passwordHash,
      },
      {
        name: 'Jordan Taylor',
        email: 'jordan.taylor@campus.edu',
        passwordHash,
      },
    ]);

    console.log('[Seed] Inserting realistic student resource listings...');
    const resources = [
      {
        title: 'Stewart Calculus: Early Transcendentals (8th Ed)',
        category: 'Textbooks',
        description: 'Hardcover textbook used for Math 101/102. Clean interior with very few light pencil markings in chapter 3. Binding is fully intact.',
        condition: 'Good',
        offerType: 'Donate',
        location: 'North Campus Library',
        availability: 'Available',
        contactMethod: 'Campus Email: alex.rivera@campus.edu',
        ownerId: alex._id,
      },
      {
        title: 'Introduction to Algorithms (CLRS 3rd Edition)',
        category: 'Textbooks',
        description: 'Comprehensive computer science algorithms reference. Paperback edition in clean condition. Looking to exchange for Artificial Intelligence: A Modern Approach or OS concepts book.',
        condition: 'Like New',
        offerType: 'Exchange',
        exchangePreference: 'Operating Systems Concepts (Silberschatz) or AI: A Modern Approach (Russell & Norvig)',
        location: 'Engineering Hall 2nd Floor',
        availability: 'Available',
        contactMethod: 'Student Discord: @maya_c',
        ownerId: maya._id,
      },
      {
        title: 'Texas Instruments TI-84 Plus Graphing Calculator',
        category: 'Calculators & Electronics',
        description: 'Working graphing calculator with fresh AAA batteries and slide cover. Screen has no dead pixels. Available for temporary loan during midterms or finals.',
        condition: 'Good',
        offerType: 'Lend',
        borrowDuration: 'Up to 3 weeks for exam period',
        location: 'Science & Math Center',
        availability: 'Available',
        contactMethod: 'Email: priya.patel@campus.edu',
        ownerId: priya._id,
      },
      {
        title: 'Organic Chemistry Model Kit (Molecular Modeling)',
        category: 'Lab & Academic Supplies',
        description: 'Complete Prentice Hall molecular model set for organic chemistry. All plastic bonds, carbons, hydrogens, and oxygens present in original plastic case.',
        condition: 'Like New',
        offerType: 'Exchange',
        exchangePreference: 'Biochemistry study guides or flashcard sets',
        location: 'Chemistry Building, Room 204',
        availability: 'Available',
        contactMethod: 'alex.rivera@campus.edu',
        ownerId: alex._id,
      },
      {
        title: 'White Unisex Lab Coat (Size Medium) & UV Safety Goggles',
        category: 'Lab & Academic Supplies',
        description: '100% cotton knee-length white lab coat with snap buttons. Washed and sanitized. Includes scratch-free clear safety goggles conforming to ANSI Z87.1.',
        condition: 'Good',
        offerType: 'Donate',
        location: 'Biological Sciences Pavilion',
        availability: 'Available',
        contactMethod: 'Jordan on campus Slack: @jordan_t',
        ownerId: jordan._id,
      },
      {
        title: 'Microeconomics & Macroeconomics Comprehensive Lecture Notes',
        category: 'Study Notes',
        description: 'Neatly organized bound notebook containing full semester lecture notes, formula cheat sheets, and solved practice problem sets for Econ 201.',
        condition: 'Like New',
        offerType: 'Donate',
        location: 'Student Union Lounge',
        availability: 'Available',
        contactMethod: 'Email: maya.chen@campus.edu',
        ownerId: maya._id,
      },
      {
        title: 'Casio fx-991EX ClassWiz Advanced Scientific Calculator',
        category: 'Calculators & Electronics',
        description: 'High-resolution scientific calculator featuring QR code function, matrix calculations, and spreadsheet mode. Clean with protective snap-on cover.',
        condition: 'New',
        offerType: 'Lend',
        borrowDuration: '1 month or through midterms',
        location: 'Central Library, Desk 14',
        availability: 'Available',
        contactMethod: 'Priya via text / campus portal',
        ownerId: priya._id,
      },
      {
        title: 'Engineering Technical Drawing Compass & Drafting Set',
        category: 'Lab & Academic Supplies',
        description: 'Precision German drafting set with bow compass, extension bar, lead cases, and divider. Essential for civil and mechanical engineering graphics.',
        condition: 'Good',
        offerType: 'Exchange',
        exchangePreference: 'Statics / Dynamics problem workbook or engineering ruler set',
        location: 'Engineering Quad',
        availability: 'Available',
        contactMethod: 'Jordan via campus email',
        ownerId: jordan._id,
      },
    ];

    await Resource.insertMany(resources);

    console.log(`[Seed] Success! Inserted 4 demo users and ${resources.length} student resources.`);
    console.log('[Seed] Demo accounts:');
    console.log(' - alex.rivera@campus.edu / student123');
    console.log(' - maya.chen@campus.edu / student123');
    console.log(' - priya.patel@campus.edu / student123');
    console.log(' - jordan.taylor@campus.edu / student123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedData();
