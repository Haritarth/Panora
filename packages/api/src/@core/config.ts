import dotenv from 'dotenv';

dotenv.config();

const config = {
  HUBSPOT_CLIENT_ID: process.env.HUBSPOT_CLIENT_ID,
  HUBSPOT_CLIENT_SECRET: process.env.HUBSPOT_CLIENT_SECRET,
  ZOHOCRM_CLIENT_ID: process.env.ZOHOCRM_CLIENT_ID,
  ZOHOCRM_CLIENT_SECRET: process.env.ZOHOCRM_CLIENT_SECRET,
  PIPEDRIVE_CLIENT_ID: process.env.PIPEDRIVE_CLIENT_ID,
  PIPEDRIVE_CLIENT_SECRET: process.env.PIPEDRIVE_CLIENT_SECRET,
  FRESHSALES_CLIENT_ID: process.env.FRESHSALES_CLIENT_ID,
  FRESHSALES_CLIENT_SECRET: process.env.FRESHSALES_CLIENT_SECRET,
  ZENDESK_CLIENT_ID: process.env.ZENDESK_CLIENT_ID,
  ZENDESK_CLIENT_SECRET: process.env.ZENDESK_CLIENT_SECRET,
  OAUTH_REDIRECT_BASE: process.env.OAUTH_REDIRECT_BASE,
};

export default config;
