const { OAuth2Client } = require('google-auth-library');
const { google } = require('../config/env');
const AppError = require('../utils/AppError');

const client = new OAuth2Client(google.clientId);

/**
 * Verifikasi ID token yang dikirim dari frontend (Google Identity Services).
 * Mengembalikan payload berisi email, name, picture, sub (googleId).
 */
async function verifyGoogleToken(idToken) {
  if (!idToken) {
    throw new AppError('Google ID token wajib disertakan', 400);
  }

  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken,
      audience: google.clientId,
    });
  } catch (err) {
    throw new AppError('Google ID token tidak valid', 401);
  }

  const payload = ticket.getPayload();

  if (!payload?.email_verified) {
    throw new AppError('Email Google belum terverifikasi', 401);
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    avatarUrl: payload.picture,
  };
}

module.exports = { verifyGoogleToken };
