const { verifyGoogleToken } = require("../services/google.service");
const {
  findOrCreateUser,
  registerWithEmail,
  loginWithEmailPassword,
  generateSessionToken,
} = require("../services/auth.service");
const { cookieName, env } = require("../config/env");

const cookieOptions = {
  httpOnly: true,
  secure: env === "production", // sameSite: 'none' WAJIB secure: true (HTTPS)
  // 'none' karena frontend (Netlify) & backend (Vercel) beda domain -- cross-site.
  // 'lax' tidak akan terkirim di skenario cross-site seperti ini.
  sameSite: env === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
};

/**
 * POST /api/auth/google
 * Body: { token: string }  <- ID token dari Google Identity Services (frontend)
 */
async function loginWithGoogle(req, res, next) {
  try {
    const { token } = req.body;

    const googlePayload = await verifyGoogleToken(token);
    const user = await findOrCreateUser(googlePayload);
    const sessionToken = generateSessionToken(user);

    res.cookie(cookieName, sessionToken, cookieOptions);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/register
 * Body: { email, password, name }
 */
async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Email, password, dan nama wajib diisi",
      });
    }

    const user = await registerWithEmail({ email, password, name });
    const sessionToken = generateSessionToken(user);

    res.cookie(cookieName, sessionToken, cookieOptions);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
async function loginWithEmail(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    const user = await loginWithEmailPassword({ email, password });
    const sessionToken = generateSessionToken(user);

    res.cookie(cookieName, sessionToken, cookieOptions);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Mengembalikan data user yang sedang login (butuh middleware auth).
 */
async function getCurrentUser(req, res) {
  res.status(200).json({ success: true, user: req.user });
}

/**
 * POST /api/auth/logout
 */
async function logout(req, res) {
  // clearCookie HARUS dipanggil dengan options yang sama (secure, sameSite, path)
  // seperti saat res.cookie() dipanggil -- kalau tidak, browser bisa anggap ini
  // cookie yang berbeda dan tidak benar-benar menghapusnya.
  res.clearCookie(cookieName, {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
  });
  res.status(200).json({ success: true, message: "Logged out" });
}

module.exports = {
  loginWithGoogle,
  register,
  loginWithEmail,
  getCurrentUser,
  logout,
};
