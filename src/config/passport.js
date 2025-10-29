import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/Usuario.js";

// Local strategy for email/password authentication
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                // Find user by email
                const user = await User.findOne({ email: email.toLowerCase() });
                
                if (!user) {
                    return done(null, false, { message: "Usuario no encontrado" });
                }

                // Check if user is active
                if (!user.isActive) {
                    return done(null, false, { message: "Usuario desactivado" });
                }

                // Verify password
                const isPasswordValid = await bcrypt.compare(password, user.password);
                
                if (!isPasswordValid) {
                    return done(null, false, { message: "Contraseña incorrecta" });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select('-password');
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
