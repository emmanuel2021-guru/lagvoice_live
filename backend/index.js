const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/preferences', require('./routes/preferencesRoutes'));
app.use('/api/evaluations', require('./routes/evaluationRoutes'));
app.use('/api/polls', require('./routes/pollRoutes'));
app.use('/api/peer-reviews', require('./routes/peerReviewRoutes'));
app.use('/api/supervisory', require('./routes/supervisoryRoutes'));
app.use('/api/qa', require('./routes/qaRoutes'));
app.use('/api/servicom', require('./routes/servicomRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/hr', require('./routes/hrRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LagVoice backend is running with Prisma & PostgreSQL' });
});

// Serve static frontend
const frontendPath = path.join(__dirname, '../dist');
app.use(express.static(frontendPath));

// Fallback to index.html for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // Start background escalation cron job
    const { startEscalationJob } = require('./services/escalationService');
    startEscalationJob();
  });
}

module.exports = app;
