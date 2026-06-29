require("dotenv").config();

const app = require("./src/app");

const connectDB = require("./src/config/db");
const { initializeDefaultMesh } = require("./src/mesh/services/testRegistry");

connectDB().then(() => {
    // Initialize the default virtual devices and connections in simulator registry
    initializeDefaultMesh();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

