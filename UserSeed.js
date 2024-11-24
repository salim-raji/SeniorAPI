const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords
const ApplicationUser = require('./models/user'); // Adjust the path as needed
const Place = require('./models/place'); // Adjust the path as needed

mongoose.connect('mongodb://localhost:27017/SeniorStudy', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Function to hash passwords
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const users = async () => [
    {
        name: 'Alice',
        email: 'alice@example.com',
        passwordHash: await hashPassword('password123'), // Hash the password
        preferences: {
            favoriteCuisines: ['Italian', 'French'],
            preferredPlaceTypes: ['Restaurant', 'Cafe'],
            budgetRange: { min: 20, max: 100 },
        },
        favorites: [
            new mongoose.Types.ObjectId('673c3174e41d7380e0aaa82d'), // Fancy Restaurant
            new mongoose.Types.ObjectId('672928595a607e67a5cc78c7'), // Gavi
            new mongoose.Types.ObjectId('672928595a607e67a5cc78ca'), // Tavolina
        ],
        interactionHistory: [
            { placeId: new mongoose.Types.ObjectId('673c3174e41d7380e0aaa82d'), interactionType: 'visited' },
            { placeId: new mongoose.Types.ObjectId('672928595a607e67a5cc78c7'), interactionType: 'favorite' },
            { placeId: new mongoose.Types.ObjectId('672928595a607e67a5cc78cb'), interactionType: 'view' },
            { placeId: new mongoose.Types.ObjectId('672928595a607e67a5cc78c8'), interactionType: 'visited' },
            { placeId: new mongoose.Types.ObjectId('672928595a607e67a5cc78ca'), interactionType: 'favorite' },
            { placeId: new mongoose.Types.ObjectId('672928595a607e67a5cc78c9'), interactionType: 'view' },
        ],
    },
    {
        name: 'Bob',
        email: 'bob@example.com',
        passwordHash: await hashPassword('password123'), // Hash the password
        preferences: {
            favoriteCuisines: ['Lebanese', 'Mexican'],
            preferredPlaceTypes: ['Restaurant', 'Historical Site'],
            budgetRange: { min: 5, max: 50 },
        },
        favorites: [
            new mongoose.Types.ObjectId('672928595a607e67a5cc78aa'), // National Museum of Beirut
            new mongoose.Types.ObjectId('672928595a607e67a5cc78ae'), // Em Sherif
            new mongoose.Types.ObjectId('672928595a607e67a5cc78af'), // Barbar
        ],
        interactionHistory: [
            { placeId: new mongoose.Types.ObjectId('673c3174e41d7380e0aaa82e'), interactionType: 'visited' },
            { placeId: new mongoose.Types.ObjectId('672928595a607e67a5cc78ad'), interactionType: 'favorite' },
            { placeId: new mongoose.Types.ObjectId('672928595a607e67a5cc78ae'), interactionType: 'view' },
            { placeId: new mongoose.Types.ObjectId('672928595a607e67a5cc78af'), interactionType: 'visited' },
            { placeId: new mongoose.Types.ObjectId('672928595a607e67a5cc78aa'), interactionType: 'favorite' },
            { placeId: new mongoose.Types.ObjectId('672928595a607e67a5cc78ac'), interactionType: 'view' },
        ],
    },
    {
        name: 'Charlie',
        email: 'charlie@example.com',
        passwordHash: await hashPassword('password123'), // Hash the password
        preferences: {
            favoriteCuisines: ['International', 'Cafe'],
            preferredPlaceTypes: ['Hotel', 'Attraction'],
            budgetRange: { min: 50, max: 300 },
        },
        favorites: [
            new mongoose.Types.ObjectId('672928595a607e67a5cc78c4'), // Zaitunay Bay
            new mongoose.Types.ObjectId('672928595a607e67a5cc78ba'), // Phoenicia Hotel Beirut
            new mongoose.Types.ObjectId('672928595a607e67a5cc78b8'), // Hotel Albergo
        ],
        interactionHistory: [
            { placeId: new mongoose.Types.ObjectId('673c3174e41d7380e0aaa82f'), interactionType: 'visited' },
            { placeId: new mongoose.Types.ObjectId('672928595a607e67a5cc78c4'), interactionType: 'favorite' },
            { placeId: new mongoose.Types.ObjectId('672928595a607e67a5cc78ba'), interactionType: 'view' },
            { placeId: new mongoose.Types.ObjectId('672928595a607e67a5cc78b8'), interactionType: 'visited' },
            { placeId: new mongoose.Types.ObjectId('672928595a607e67a5cc78b9'), interactionType: 'favorite' },
            { placeId: new mongoose.Types.ObjectId('672928595a607e67a5cc78bd'), interactionType: 'view' },
        ],
    },
];

const seedDatabase = async () => {
    try {
        // Clear the ApplicationUser collection
        await ApplicationUser.deleteMany();

        // Insert sample users
        const userData = await users();
        await ApplicationUser.insertMany(userData);

        console.log('Database seeded successfully!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    }
};

seedDatabase();
