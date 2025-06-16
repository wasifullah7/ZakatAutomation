require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path if your User model is elsewhere
const bcrypt = require('bcryptjs'); // Needed for hashing passwords

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zakat_system'; // Fallback to local if env not set

const generateRandomString = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const generateDateInPast = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const generateFutureDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const generateMuslimName = () => {
    const firstNames = [
        "Aisha", "Omar", "Fatima", "Ali", "Zara", "Ahmed", "Noor", "Hassan",
        "Layla", "Imran", "Sana", "Khalid", "Amira", "Yusuf", "Mariam", "Bilal",
        "Samira", "Jafar", "Khadija", "Rami"
    ];
    const lastNames = [
        "Khan", "Ali", "Ahmed", "Hussein", "Mohammad", "Siddiqui", "Malik", "Rana",
        "Chaudhry", "Butt", "Javed", "Suleiman", "Shah", "Qureshi", "Farooqi", "Ansari",
        "Zaidi", "Rizvi", "Bukhari", "Abbasi"
    ];
    return {
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)]
    };
};

const generateRandomAddress = () => {
    const streets = ["Main St", "Oak Ave", "Pine Ln", "Elm Rd", "Maple Dr", "Cedar Ct", "Birch Blvd"];
    const cities = ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi", "Peshawar", "Quetta"];
    const countries = ["Pakistan", "Bangladesh", "Indonesia", "Egypt", "Malaysia"];
    const postalCodes = ["75500", "54000", "44000", "38000", "46000", "25000", "87300"];
    
    return {
        address: `${Math.floor(Math.random() * 1000) + 1} ${streets[Math.floor(Math.random() * streets.length)]}`,
        city: cities[Math.floor(Math.random() * cities.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        postalCode: postalCodes[Math.floor(Math.random() * postalCodes.length)]
    };
};


const generateUsers = async () => {
  const users = [];
  const commonPassword = 'password123'; // Strong enough for dev, change for prod

  // 20 Donors
  for (let i = 0; i < 20; i++) {
    const name = generateMuslimName();
    const address = generateRandomAddress();
    const isApprovedDonor = i < 3; // First 3 donors are approved, rest pending
    users.push({
      firstName: name.firstName,
      lastName: name.lastName,
      email: `${name.firstName.toLowerCase()}.${name.lastName.toLowerCase()}${i}@donor.com`,
      password: commonPassword,
      role: 'donor',
      isActive: true,
      profile: {
        phone: `+923${Math.floor(100000000 + Math.random() * 900000000)}`,
        address: address.address,
        city: address.city,
        country: address.country,
        postalCode: address.postalCode,
        nationalId: `ID${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
        nationalIdExpiry: generateFutureDate(365 * 5),
        bankName: 'Bank Islamic',
        bankBranch: 'Main Branch',
        bankAccountNumber: `PK${Math.floor(10000000000000000 + Math.random() * 90000000000000000)}`,
        organizationName: `${name.firstName} ${name.lastName} Charity`,
        organizationType: 'Charity',
        registrationNumber: `REG${Math.floor(100000 + Math.random() * 900000)}`,
        registrationDate: generateDateInPast(365 * 2),
        registrationExpiry: generateFutureDate(365 * 3),
        documents: [
            {
                type: 'National ID',
                filename: 'national_id.jpg',
                url: 'https://example.com/docs/national_id.jpg',
                verified: true
            },
            {
                type: 'Organization Registration',
                filename: 'org_reg.pdf',
                url: 'https://example.com/docs/org_reg.pdf',
                verified: true
            }
        ]
      },
      verificationStatus: isApprovedDonor ? 'approved' : 'pending',
      verificationHistory: isApprovedDonor ? [{
        status: 'approved',
        changedBy: null, // Would be an admin ID in real scenario
        reason: 'Initial data population approval'
      }] : [{
        status: 'pending',
        changedBy: null,
        reason: 'New application awaiting review'
      }],
    });
  }

  // 20 Acceptors
  for (let i = 0; i < 20; i++) {
    const name = generateMuslimName();
    const address = generateRandomAddress();
    const isApprovedAcceptor = i < 3; // First 3 acceptors are approved, rest pending

    users.push({
      firstName: name.firstName,
      lastName: name.lastName,
      email: `${name.firstName.toLowerCase()}.${name.lastName.toLowerCase()}${i}@acceptor.com`,
      password: commonPassword,
      role: 'acceptor',
      isActive: true,
      profile: {
        phone: `+923${Math.floor(100000000 + Math.random() * 900000000)}`,
        address: address.address,
        city: address.city,
        country: address.country,
        postalCode: address.postalCode,
        nationalId: `ID${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
        nationalIdExpiry: generateFutureDate(365 * 5),
        familySize: Math.floor(Math.random() * 8) + 1, // 1 to 8 members
        monthlyIncome: Math.floor(Math.random() * 20000) + 5000, // 5000 to 25000
        monthlyExpenses: Math.floor(Math.random() * 15000) + 3000, // 3000 to 18000
        bankName: 'EasyPaisa',
        bankBranch: 'Online',
        bankAccountNumber: `PK${Math.floor(10000000000000000 + Math.random() * 90000000000000000)}`,
        assets: ['Basic Household Items'],
        liabilities: ['Rent', 'Utilities'],
        zakatReason: `This is a detailed reason why ${name.firstName} ${name.lastName} needs Zakat, explaining their current financial hardship and how the funds will be utilized for their family of ${Math.floor(Math.random() * 8) + 1} members. The family struggles with medical expenses and education costs. They are committed to improving their situation.`,
        documents: [
            {
                type: 'National ID',
                filename: 'acceptor_id.jpg',
                url: 'https://example.com/docs/acceptor_id.jpg',
                verified: true
            },
            {
                type: 'Proof of Address',
                filename: 'proof_address.pdf',
                url: 'https://example.com/docs/proof_address.pdf',
                verified: true
            },
            ...(isApprovedAcceptor ? [{
                type: 'Bank Statement',
                filename: 'bank_statement.pdf',
                url: 'https://example.com/docs/bank_statement.pdf',
                verified: true
            }] : []),
        ],
        needs: ['Food', 'Healthcare', 'Education'],
        emergencyContact: {
          name: generateMuslimName().firstName + " " + generateMuslimName().lastName,
          relationship: 'Sibling',
          phone: `+923${Math.floor(100000000 + Math.random() * 900000000)}`
        },
      },
      verificationStatus: isApprovedAcceptor ? 'approved' : 'pending',
      verificationHistory: isApprovedAcceptor ? [{
        status: 'approved',
        changedBy: null,
        reason: 'Initial data population approval'
      }] : [{
        status: 'pending',
        changedBy: null,
        reason: 'New application awaiting review'
      }],
    });
  }

  // Hash passwords
  for (const user of users) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  return users;
};

const populateDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected...');

    // Clear existing users
    await User.deleteMany({});
    console.log('Existing users cleared.');

    const usersToInsert = await generateUsers();
    await User.insertMany(usersToInsert);
    console.log('Database populated with mock data!');

  } catch (err) {
    console.error(err.message);
  } finally {
    mongoose.connection.close();
  }
};

populateDatabase();
