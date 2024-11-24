// migrate.js
const mongoose = require('mongoose');
const Migrate = require('migrate-mongoose');

const connectionString = 'mongodb://localhost:27017/SeniorStudy';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB for migration");
    return Migrate({
        mongoose,
        migrationsDir: './migrations',
        migrationFileExtension: '.js',
    });
}).catch(error => console.log("MongoDB connection error:", error));
