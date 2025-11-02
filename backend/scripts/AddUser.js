const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust the path to your User model

// MongoDB connection string
const MONGODB_URI = 'mongodb://127.0.0.1:27017/abcd';

// User data sorted by createdAt (oldest first)
const usersData = [
  {
    fullName: 'MR SATISH BANSAL',
    mobile: 8966983066,
    email: 'ashok.toolmachinery@yahoo.in',
    gotra: 'Bansal',
    city: 'Bilaspur - Bilaspur',
    address: 'ASHOK TOOLS\r\nGOVERNMENT SCHOOL BUILDING MARKET\r\nDAYALBAND, BILASPUR',
    fatherName: 'LATE SRI RAM JIVAN BANSAL',
    passportPhoto: 'upload/passport-photos/passport-1761824062589-253844620.webp',
    authProvider: 'local',
    isVerified: true,
    isMobileVerified: false,
    isEmailVerified: false,
    utrNumber: '528596315327',
    paymentVerified: true,
    isRejected: false,
    createdAt: new Date('2025-10-30T11:34:22.658Z'),
    updatedAt: new Date('2025-10-30T11:35:55.705Z'),
    __v: 0,
    certificateDownloadLink: '/uploads/certificates/certificate_69034d3ee16eeff600e527fa_1761824155487.pdf',
    certificateExpiryDate: new Date('2027-03-31T00:00:00.000Z'),
    certificateIssueDate: new Date('2025-10-30T11:35:55.705Z'),
    certificateNumber: 'YM-CG-2025-10-000001'
  },
  {
    fullName: 'MR RIDEEM BINDAL',
    mobile: 7077146335,
    email: 'ar.rideembindal@gmail.com',
    gotra: 'Bindal',
    city: 'Raipur - Raipur',
    address: '32 HUMMING COTERIE, KACHNA, RAIPUR',
    fatherName: 'MR DILIP BINDAL',
    passportPhoto: 'upload/passport-photos/passport-1761826051021-951853949.webp',
    authProvider: 'local',
    isVerified: true,
    isMobileVerified: false,
    isEmailVerified: false,
    utrNumber: '528596312228',
    paymentVerified: true,
    isRejected: false,
    createdAt: new Date('2025-10-30T12:07:31.211Z'),
    updatedAt: new Date('2025-10-30T12:14:58.811Z'),
    __v: 0,
    certificateDownloadLink: '/uploads/certificates/certificate_69035503e16eeff600e52807_1761826498565.pdf',
    certificateExpiryDate: new Date('2027-03-31T00:00:00.000Z'),
    certificateIssueDate: new Date('2025-10-30T12:14:58.808Z'),
    certificateNumber: 'YM-CG-2025-10-000002'
  },
  {
    fullName: 'RICHA AGRAWAL',
    mobile: 8871027825,
    email: 'richaagrawal.tex@gmail.com',
    gotra: 'Garg',
    city: 'Raipur - Raipur',
    address: 'VIJAY TEXTILES \r\n' +
      '05,MAIN ROAD, NEAR BLUE BIRD SCHOOL \r\n' +
      'NIHARIKA,KORBA-495677',
    fatherName: 'VIJAY KUMAR AGRAWAL',
    passportPhoto: 'upload/passport-photos/passport-1761911127238-653849326.webp',
    authProvider: 'local',
    isVerified: true,
    isMobileVerified: false,
    isEmailVerified: false,
    utrNumber: '036286379000',
    paymentVerified: true,
    isRejected: false,
    createdAt: new Date('2025-10-31T11:45:27.427Z'),
    updatedAt: new Date('2025-10-31T11:46:12.989Z'),
    __v: 0,
    certificateDownloadLink: '/uploads/certificates/certificate_6904a157e16eeff600e5281f_1761911172603.pdf',
    certificateExpiryDate: new Date('2027-03-31T00:00:00.000Z'),
    certificateIssueDate: new Date('2025-10-31T11:46:12.985Z'),
    certificateNumber: 'YM-CG-2025-10-000003'
  },
  {
    fullName: 'Mr NIKHIL AGRAWAL',
    mobile: 9303790005,
    email: 'nikhil.l.agrawal@gmail.com',
    gotra: 'Singhal',
    city: 'Raipur - Raipur',
    address: 'HN 185 , HAMMING COTERIE\r\nKACHNA',
    fatherName: 'Lt  SHREE LALIT AGRAWAL',
    passportPhoto: 'upload/passport-photos/passport-1761914397380-709369820.webp',
    authProvider: 'local',
    isVerified: true,
    isMobileVerified: false,
    isEmailVerified: false,
    utrNumber: '562136461358',
    paymentVerified: true,
    isRejected: false,
    createdAt: new Date('2025-10-31T12:39:57.593Z'),
    updatedAt: new Date('2025-10-31T12:41:06.126Z'),
    __v: 0,
    certificateDownloadLink: '/uploads/certificates/certificate_6904ae1de16eeff600e5282d_1761914465966.pdf',
    certificateExpiryDate: new Date('2027-03-31T00:00:00.000Z'),
    certificateIssueDate: new Date('2025-10-31T12:41:06.125Z'),
    certificateNumber: 'YM-CG-2025-10-000004'
  },
  {
    fullName: 'Om Agrawal',
    mobile: 8085346012,
    gotra: 'Singhal',
    city: 'Raipur - Raipur',
    address: 'House No 93\r\nHamming cotery \r\nKachna',
    fatherName: 'Late Sh. Laxman Agrawal',
    passportPhoto: 'upload/passport-photos/passport-1761915863334-374329890.webp',
    authProvider: 'local',
    isVerified: true,
    isMobileVerified: false,
    isEmailVerified: false,
    paymentScreenshot: 'upload/payment-screenshots/payment-1761915863415-622010681.webp',
    paymentVerified: true,
    isRejected: false,
    createdAt: new Date('2025-10-31T13:04:23.497Z'),
    updatedAt: new Date('2025-10-31T13:04:59.900Z'),
    __v: 0,
    certificateDownloadLink: '/uploads/certificates/certificate_6904b3d7e16eeff600e5283b_1761915899772.pdf',
    certificateExpiryDate: new Date('2027-03-31T00:00:00.000Z'),
    certificateIssueDate: new Date('2025-10-31T13:04:59.899Z'),
    certificateNumber: 'YM-CG-2025-10-000005'
  },
  {
    fullName: 'Rajesh Goyal',
    mobile: 9406083044,
    email: 'rajeshgoyal584@gmail.com',
    gotra: 'Goyal',
    city: 'Pithora - Mahasamund',
    address: "Amit tirupur Garment's \r\nNH 53\r\nRamkumar Goyal  chowk",
    fatherName: 'Late shree Ramkumar goyal',
    passportPhoto: 'upload/passport-photos/passport-1761931642877-939111837.webp',
    authProvider: 'local',
    isVerified: true,
    isMobileVerified: false,
    isEmailVerified: false,
    paymentScreenshot: 'upload/payment-screenshots/payment-1761931643061-266076145.webp',
    utrNumber: '555259417612',
    paymentVerified: true,
    isRejected: false,
    createdAt: new Date('2025-10-31T17:27:23.398Z'),
    updatedAt: new Date('2025-11-02T02:41:28.938Z'),
    __v: 0,
    certificateDownloadLink: '/uploads/certificates/certificate_6904f17be16eeff600e5284b_1762051288409.pdf',
    certificateExpiryDate: new Date('2027-03-31T00:00:00.000Z'),
    certificateIssueDate: new Date('2025-11-02T02:41:28.933Z'),
    certificateNumber: 'YM-CG-2025-11-000006'
  },
  {
    fullName: 'Mr RAJ KUMAR AGRAWAL',
    mobile: 9300099898,
    email: 'rajkumargoyal123agrawal@gmail.com',
    gotra: 'Goyal',
    city: 'Raipur - Raipur',
    address: '190, HAMMING COTERIE \r\nKachna RAIPUR',
    fatherName: 'Sri NARAYAN AGRAWAL',
    passportPhoto: 'upload/passport-photos/passport-1762053535505-140604961.webp',
    authProvider: 'local',
    isVerified: true,
    isMobileVerified: false,
    isEmailVerified: false,
    utrNumber: '530631820592',
    paymentVerified: true,
    isRejected: false,
    createdAt: new Date('2025-11-02T03:18:55.900Z'),
    updatedAt: new Date('2025-11-02T03:24:08.552Z'),
    __v: 0,
    certificateDownloadLink: '/uploads/certificates/certificate_6906cd9fe16eeff600e5285f_1762053848458.pdf',
    certificateExpiryDate: new Date('2027-03-31T00:00:00.000Z'),
    certificateIssueDate: new Date('2025-11-02T03:24:08.551Z'),
    certificateNumber: 'YM-CG-2025-11-000008'
  },
  {
    fullName: 'Mr VISHNU AGRAWAL',
    mobile: 8827925012,
    email: 'vishnu25012@Gmail.com',
    gotra: 'Singhal',
    city: 'Raipur - Raipur',
    address: '225, HAMMING COTERIE \r\nKACHNA RAIPUR',
    fatherName: 'Lt SRI PRADEEP AGRAWAL',
    passportPhoto: 'upload/passport-photos/passport-1762053826857-901278975.webp',
    authProvider: 'local',
    isVerified: true,
    isMobileVerified: false,
    isEmailVerified: false,
    utrNumber: '530631863563',
    paymentVerified: true,
    isRejected: false,
    createdAt: new Date('2025-11-02T03:23:47.006Z'),
    updatedAt: new Date('2025-11-02T03:24:03.933Z'),
    __v: 0,
    certificateDownloadLink: '/uploads/certificates/certificate_6906cec3e16eeff600e52862_1762053843740.pdf',
    certificateExpiryDate: new Date('2027-03-31T00:00:00.000Z'),
    certificateIssueDate: new Date('2025-11-02T03:24:03.932Z'),
    certificateNumber: 'YM-CG-2025-11-000007'
  },
  {
    fullName: 'Akash kumar agrawal',
    mobile: 9644410226,
    email: 'ajsakash@yahoo.co.in',
    gotra: 'Mittal',
    city: 'Raipur - Raipur',
    address: 'A2_201 , LUXORA APARTMENT, INFRONT OF VISHWA BHARTI MARUTI, MOWA RAIPUR CHHATTISGARH',
    fatherName: 'Late Shri Mohan lal Agrawal',
    passportPhoto: 'upload/passport-photos/passport-1762063973078-846882709.webp',
    authProvider: 'local',
    isVerified: false,
    isMobileVerified: false,
    isEmailVerified: false,
    paymentScreenshot: 'upload/payment-screenshots/payment-1762063973302-882114189.webp',
    paymentVerified: false,
    isRejected: false,
    createdAt: new Date('2025-11-02T06:12:53.632Z'),
    updatedAt: new Date('2025-11-02T06:12:53.632Z'),
    __v: 0
  },
  {
    fullName: 'PANKAJ AGRAWAL',
    mobile: 9993711113,
    email: 'pankaj09309@gmail.com',
    gotra: 'Singhal',
    city: 'PITHORA - MAHASAMUND',
    address: 'NEW SINGHAL BARTAN BHANDAR, NEAR CIVIL COURT, MAIN ROAD, PITHORA',
    fatherName: 'MR. ASHOK AGRAWAL',
    passportPhoto: 'upload/passport-photos/passport-1762065249888-834831288.webp',
    authProvider: 'local',
    isVerified: false,
    isMobileVerified: false,
    isEmailVerified: false,
    paymentScreenshot: 'upload/payment-screenshots/payment-1762065249953-355696995.webp',
    paymentVerified: false,
    isRejected: false,
    activeCertificate: null,
    createdAt: new Date('2025-11-02T06:34:10.002Z'),
    updatedAt: new Date('2025-11-02T06:34:10.002Z'),
    __v: 0
  },
  {
    fullName: 'RAJESH AGRAWAL',
    mobile: 8435548455,
    email: 'rajeshagrawal61976@gmail.com',
    gotra: 'Mittal',
    city: 'PITHORA - MAHASAMUND',
    address: 'RAJESH AGRAWAL SARAKTORA\r\n' +
      'POST SONASILLI\r\n' +
      'BLOCK PITHORA \r\n' +
      'JILA MAHASMUND (CG.)',
    fatherName: 'LATE SHRI  MAHABIR AGRAWAL',
    passportPhoto: 'upload/passport-photos/passport-1762065309718-98125268.webp',
    authProvider: 'local',
    isVerified: false,
    isMobileVerified: false,
    isEmailVerified: false,
    paymentScreenshot: 'upload/payment-screenshots/payment-1762065309728-116899342.webp',
    utrNumber: '886879960584',
    paymentVerified: false,
    isRejected: false,
    activeCertificate: null,
    createdAt: new Date('2025-11-02T06:35:09.869Z'),
    updatedAt: new Date('2025-11-02T06:35:09.869Z'),
    __v: 0
  }


];

async function addUsers() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!\n');

    // Sort users by createdAt (oldest first) - already sorted in the data above
    const sortedUsers = usersData.sort((a, b) =>
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    console.log(`Found ${sortedUsers.length} users to insert\n`);

    // Process and insert users one by one in order
    for (let i = 0; i < sortedUsers.length; i++) {
      const userData = sortedUsers[i];

      // Transform the user data
      const userToInsert = {
        fullName: userData.fullName.toUpperCase(), // Convert to uppercase
        mobile: userData.mobile,
        email: userData.email,
        gotra: userData.gotra,
        city: userData.city,
        address: userData.address,
        fatherName: userData.fatherName.toUpperCase(), // Convert to uppercase
        passportPhoto: userData.passportPhoto,
        authProvider: userData.authProvider,
        isVerified: false, // Set to false for all users
        isMobileVerified: userData.isMobileVerified,
        isEmailVerified: userData.isEmailVerified,
        paymentVerified: userData.paymentVerified,
        isRejected: userData.isRejected,
        __v: userData.__v
      };

      // Add optional fields if they exist
      if (userData.utrNumber) {
        userToInsert.utrNumber = userData.utrNumber;
      }
      if (userData.paymentScreenshot) {
        userToInsert.paymentScreenshot = userData.paymentScreenshot;
      }
      if (userData.activeCertificate !== undefined) {
        userToInsert.activeCertificate = userData.activeCertificate;
      }

      // Note: Not including certificateDownloadLink, certificateExpiryDate,
      // certificateIssueDate, certificateNumber as per requirements
      // Also not including createdAt and updatedAt - MongoDB will auto-generate them

      try {
        const newUser = await User.create(userToInsert);
        console.log(`✓ [${i + 1}/${sortedUsers.length}] Inserted: ${newUser.fullName} (New ID: ${newUser._id})`);
      } catch (error) {
        console.error(`✗ [${i + 1}/${sortedUsers.length}] Failed to insert ${userData.fullName}:`, error.message);
      }
    }

    console.log('\n✓ User insertion completed!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

// Run the script
addUsers();
