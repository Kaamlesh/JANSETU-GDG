const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsappService');

/**
 * Meta WhatsApp Cloud API Webhook Verification
 */
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'jandrishti_brics_token_2026';

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ [WhatsApp Webhook Verified Successfully]');
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }
  return res.status(200).send('JanDrishti WhatsApp Webhook is active');
});

/**
 * Meta WhatsApp Cloud API Inbound Message Event
 */
router.post('/webhook', async (req, res) => {
  try {
    const body = req.body;
    console.log('Incoming WhatsApp Webhook Payload:', JSON.stringify(body, null, 2));

    // Acknowledge Meta immediately
    res.status(200).send('EVENT_RECEIVED');

    // Parse Meta message object if present
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (message) {
      const from = message.from;
      let text = '';
      let messageType = message.type;
      
      if (message.type === 'text') {
        text = message.text?.body;
      } else if (message.type === 'audio') {
        text = 'Voice message received via WhatsApp audio stream';
      }

      await whatsappService.processIncomingMessage({
        from,
        messageType,
        text,
        language: 'ta'
      });
    }
  } catch (err) {
    console.error('Error handling webhook event:', err);
  }
});

/**
 * Interactive WhatsApp Bot Simulator endpoint for Hackathon Demo UI
 */
router.post('/simulate', async (req, res) => {
  try {
    const { from = '+91 94421 88392', messageType = 'text', text, mediaBase64, mediaUrl, language = 'ta' } = req.body;

    const result = await whatsappService.processIncomingMessage({
      from,
      messageType,
      text,
      mediaBase64,
      mediaUrl,
      language
    });

    return res.json(result);
  } catch (err) {
    console.error('Error in WhatsApp simulator:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
