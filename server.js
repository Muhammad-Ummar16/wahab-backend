const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// File Upload Endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const { oldUrl } = req.body;

    // Cleanup logic: If there's an oldUrl pointing to a local file, delete it
    if (oldUrl && oldUrl.includes('http://localhost:5000/uploads/')) {
        const oldFileName = oldUrl.split('/').pop();
        const oldFilePath = path.join(uploadDir, oldFileName);

        try {
            if (await fs.exists(oldFilePath)) {
                await fs.remove(oldFilePath);
                console.log(`Deleted old file: ${oldFileName}`);
            }
        } catch (err) {
            console.error(`Error deleting old file ${oldFileName}:`, err);
        }
    }

    const fileUrl = `${BASE_URL}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

const DATA_DIR = path.join(__dirname, 'data');

// Utility to read data
const readData = async (filename) => {
    try {
        const filePath = path.join(DATA_DIR, filename);
        return await fs.readJson(filePath);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return null;
    }
};

// Utility to write data
const writeData = async (filename, data) => {
    try {
        const filePath = path.join(DATA_DIR, filename);
        await fs.writeJson(filePath, data, { spaces: 2 });
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        return false;
    }
};

// Generic Routes
const resources = ['hero', 'about', 'contact', 'education', 'skills', 'certifications', 'projects'];

resources.forEach(resource => {
    const filename = `${resource}.json`;

    // GET all
    app.get(`/api/${resource}`, async (req, res) => {
        const data = await readData(filename);
        res.json(data);
    });

    // POST (Add new item if it's an array, or replace if object)
    app.post(`/api/${resource}`, async (req, res) => {
        const data = await readData(filename);
        if (Array.isArray(data)) {
            const newItem = { id: Date.now(), ...req.body };
            data.push(newItem);
            await writeData(filename, data);
            res.status(201).json(newItem);
        } else {
            await writeData(filename, req.body);
            res.json(req.body);
        }
    });

    // Special PUT for single objects (like hero)
    app.put(`/api/${resource}`, async (req, res) => {
        const data = await readData(filename);
        if (!Array.isArray(data)) {
            await writeData(filename, req.body);
            res.json(req.body);
        } else {
            res.status(400).json({ message: "Use /api/:resource/:id for arrays" });
        }
    });

    // PUT (Update existing item by ID)
    app.put(`/api/${resource}/:id`, async (req, res) => {
        const data = await readData(filename);
        if (Array.isArray(data)) {
            const index = data.findIndex(item => item.id == req.params.id);
            if (index !== -1) {
                data[index] = { ...data[index], ...req.body };
                await writeData(filename, data);
                res.json(data[index]);
            } else {
                res.status(404).json({ message: 'Not found' });
            }
        } else {
            // For single object resources like hero
            await writeData(filename, req.body);
            res.json(req.body);
        }
    });

    // DELETE (Remove existing item by ID)
    app.delete(`/api/${resource}/:id`, async (req, res) => {
        const data = await readData(filename);
        if (Array.isArray(data)) {
            const index = data.findIndex(item => item.id == req.params.id);
            if (index !== -1) {
                const removed = data.splice(index, 1);
                await writeData(filename, data);
                res.json(removed[0]);
            } else {
                res.status(404).json({ message: 'Not found' });
            }
        } else {
            res.status(400).json({ message: 'Cannot delete a single-object resource' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on ${BASE_URL}`);
});
