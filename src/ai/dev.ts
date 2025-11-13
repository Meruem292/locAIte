'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-location-history.ts';
import '@/ai/flows/predict-tag-location.ts';
