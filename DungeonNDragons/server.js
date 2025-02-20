const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env

// Initialize the app
const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.static("Prototype"));

app.use(express.json());

app.use(bodyParser.json());

app.use(cors());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {   
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB!");
});

// Define an Inventory Schema
const inventorySchema = new mongoose.Schema({
    itemName: String,
    items: [String],
});

const Inventory = mongoose.model("Inventory", inventorySchema);

// Routes
// Save inventory
app.post("/inventory", async (req, res) => {
    console.log("Received POST request to /inventory");
    console.log("Request body:", req.body);
    const { itemName, items } = req.body;

    // Validate input
    if (!itemName) {
        console.error("No itemName provided");
        return res.status(400).json({ 
            success: false, 
            message: "itemName is required" 
        });
    }

    if (!items || !Array.isArray(items)) {
        console.error("Invalid items array");
        return res.status(400).json({ 
            success: false, 
            message: "items must be an array" 
        });
    }

    try {
        let inventory = await Inventory.findOne({ itemName });
        if (inventory) {
            // Update existing inventory
            console.log("Updating existing inventory for:", itemName);
            inventory.items = items;
        } else {
            // Create new inventory
            console.log("Creating new inventory for:", itemName);
            inventory = new Inventory({ itemName, items });
        }
        const savedInventory = await inventory.save();
        console.log("Saved inventory:", savedInventory);
        
        res.json({ success: true, inventory: savedInventory });
    } catch (err) {
        console.error("Full error details:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get inventory

app.get("/", function(req,res) {
    res.sendFile(__dirname + "/Prototype/hiddenObject.html");
})

app.get("/inventory/:characterName", async (req, res) => {
    try {
        const characterName = req.params.characterName;
        const inventory = await Inventory.findOne({ itemName: characterName });
        if (!inventory) {
            return res.json({ success: false, message: "Inventory not found" });
        }
        res.json({ success: true, inventory });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
