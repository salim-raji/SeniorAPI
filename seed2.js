const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://localhost:27017";
const dbName = "SeniorStudy"; // Replace with your database name

const dataPart8 = [
  {
    _id: new ObjectId("672928595a607e67a5cc78c8"),
    name: "La Traviata",
    type: "Restaurant",
    address: "Hamra St, Beirut, Lebanon",
    description:
      "Traditional Italian trattoria offering classic pizzas, pastas, and a cozy ambiance.",
    cuisineType: "Italian",
    rating: 4.4,
    amenities: ["wifi"],
    priceRange: "15-20",
    preferredActivities: [],
    dietaryRestrictions: ["vegetarian"],
    familyFriendly: true,
    outdoorSeating: false,
    recommendedFor: ["family dinners", "casual dining"],
    tags: ["traditional", "italian", "trattoria"],
    relatedPlaces: [
      new ObjectId("672928595a607e67a5cc78cb"),
      new ObjectId("672928595a607e67a5cc78c7"),
      new ObjectId("672928595a607e67a5cc78c9"),
    ],
    trending: true,
    seasonal: false,
    minBudget: 15,
    maxBudget: 20,
  },
  {
    _id: new ObjectId("672928595a607e67a5cc78c9"),
    name: "Margherita Mare",
    type: "Restaurant",
    address: "Dbayeh Seaside Road, Beirut, Lebanon",
    description:
      "Seaside Italian restaurant offering Neapolitan pizzas, pasta, and seafood with a view.",
    cuisineType: "Italian",
    rating: 4.5,
    amenities: ["outdoor seating", "seaside view"],
    priceRange: "15-30",
    preferredActivities: [],
    dietaryRestrictions: ["vegetarian"],
    familyFriendly: true,
    recommendedFor: ["lunch", "dinner"],
    tags: ["seaside", "italian", "restaurant"],
    relatedPlaces: [
      new ObjectId("672928595a607e67a5cc78c7"),
      new ObjectId("672928595a607e67a5cc78cb"),
      new ObjectId("672928595a607e67a5cc78c8"),
    ],
    trending: false,
    seasonal: true,
    minBudget: 15,
    maxBudget: 30,
  },
  {
    _id: new ObjectId("672928595a607e67a5cc78ca"),
    name: "Tavolina",
    type: "Restaurant",
    address: "Mar Mikhael, Beirut, Lebanon",
    description:
      "Trendy Italian spot with a rustic setting, specializing in homemade pasta and fresh ingredients.",
    cuisineType: "Italian",
    rating: 4.6,
    amenities: ["wifi", "outdoor seating"],
    priceRange: "12-30",
    preferredActivities: [],
    dietaryRestrictions: ["vegetarian"],
    familyFriendly: true,
    recommendedFor: ["lunch", "dinner"],
    tags: ["trendy", "italian", "spot"],
    relatedPlaces: [
      new ObjectId("672928595a607e67a5cc78c7"),
      new ObjectId("672928595a607e67a5cc78cb"),
      new ObjectId("672928595a607e67a5cc78c8"),
    ],
    trending: true,
    seasonal: false,
    minBudget: 12,
    maxBudget: 30,
  },
  {
    _id: new ObjectId("672928595a607e67a5cc78cb"),
    name: "Appetito Trattoria",
    type: "Restaurant",
    address: "Gemmayze, Beirut, Lebanon",
    description:
      "Casual and cozy Italian eatery known for hearty pasta, pizza, and traditional Italian dishes.",
    cuisineType: "Italian",
    rating: 4.5,
    amenities: ["wifi"],
    priceRange: "20-25",
    preferredActivities: [],
    dietaryRestrictions: ["vegetarian"],
    familyFriendly: true,
    recommendedFor: ["casual dining", "family gatherings"],
    tags: ["casual", "cozy", "italian"],
    relatedPlaces: [
      new ObjectId("672928595a607e67a5cc78c7"),
      new ObjectId("672928595a607e67a5cc78c9"),
      new ObjectId("672928595a607e67a5cc78ca"),
    ],
    trending: false,
    seasonal: true,
    minBudget: 20,
    maxBudget: 25,
  },
];

async function seedDatabasePart8() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("places"); // Replace with your collection name

    const result = await collection.insertMany(dataPart8);

    console.log(`${result.insertedCount} documents from Part 8 were inserted.`);
  } catch (error) {
    console.error("Error seeding the database (Part 8):", error);
  } finally {
    await client.close();
  }
}

seedDatabasePart8();
