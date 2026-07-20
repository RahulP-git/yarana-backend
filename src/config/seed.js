const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("../src/models/Category");

dotenv.config();

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const categories = [
            { name: "Plumbing", slug: "plumbing", backgroundColor: "#EAF3FF" },
            { name: "Painting", slug: "painting", backgroundColor: "#FFF0D8" },
            { name: "Electrical", slug: "electrical", backgroundColor: "#FFF5D1" },
            { name: "Cleaning", slug: "cleaning", backgroundColor: "#EAFBF0" },
            { name: "Carpentry", slug: "carpentry", backgroundColor: "#F1F1F7" },
            { name: "AC Repair", slug: "ac-repair", backgroundColor: "#E1F6FF" },
            { name: "Appliance", slug: "appliance", backgroundColor: "#F6F2EE" },
            { name: "Building", slug: "building", backgroundColor: "#E9F6E8" }
        ];

        for (const cat of categories) {
            await Category.findOneAndUpdate(
                { slug: cat.slug },
                cat,
                { upsert: true, new: true }
            );
            console.log(`Seeded: ${cat.name}`);
        }

        console.log("All categories seeded successfully");
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
        process.exit(0);
    } catch (error) {
        console.error("Seed error:", error);
        process.exit(1);
    }
};

seedCategories();
