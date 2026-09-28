const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getPolls = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // We fetch all polls and attach the user's response if any
    const polls = await prisma.poll.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const responses = await prisma.pollResponse.findMany({
      where: { userId }
    });
    
    // We also need aggregate results for closed polls
    const resultsAgg = await prisma.pollResponse.groupBy({
      by: ['pollId', 'optionIndex'],
      _count: { optionIndex: true }
    });

    const formattedPolls = polls.map(poll => {
      const userResponse = responses.find(r => r.pollId === poll.id);
      
      // Calculate total responses for this poll
      const pollResults = resultsAgg.filter(r => r.pollId === poll.id);
      const totalResponses = pollResults.reduce((sum, curr) => sum + curr._count.optionIndex, 0);
      
      // Calculate individual option results array (matching length of options)
      let results = null;
      if (poll.status === 'closed') {
        results = poll.options.map((_, i) => {
          const res = pollResults.find(r => r.optionIndex === i);
          return res ? res._count.optionIndex : 0;
        });
      }

      return {
        ...poll,
        responded: !!userResponse,
        userOptionIndex: userResponse ? userResponse.optionIndex : null,
        totalResponses,
        results
      };
    });

    res.status(200).json({ success: true, data: formattedPolls });
  } catch (err) {
    next(err);
  }
};

exports.submitResponse = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { pollId, optionIndex } = req.body;

    const poll = await prisma.poll.findUnique({ where: { id: parseInt(pollId) } });
    if (!poll || poll.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Poll is not active or does not exist.' });
    }

    const existing = await prisma.pollResponse.findUnique({
      where: {
        pollId_userId: { pollId: parseInt(pollId), userId }
      }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already voted in this poll.' });
    }

    const response = await prisma.pollResponse.create({
      data: {
        pollId: parseInt(pollId),
        userId,
        optionIndex: parseInt(optionIndex)
      }
    });

    res.status(201).json({ success: true, data: response });
  } catch (err) {
    next(err);
  }
};
