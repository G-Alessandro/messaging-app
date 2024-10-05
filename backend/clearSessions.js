const mongoose = require("mongoose");
require("dotenv").config();

const mongoDB = process.env.MONGODB_URI; // Assicurati di avere l'URI di connessione nel tuo file .env

async function clearSessions() {
  try {
    // Connessione al database
    await mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connesso al database MongoDB");

    // Definire il modello per la collezione "sessions"
    const sessionSchema = new mongoose.Schema({}, { collection: 'sessions' });
    const Session = mongoose.model('Session', sessionSchema);

    // Cancellare tutti i documenti nella collezione "sessions"
    const result = await Session.deleteMany({});
    console.log(`Documenti cancellati: ${result.deletedCount}`);

  } catch (error) {
    console.error("Errore durante la cancellazione delle sessioni:", error);
  } finally {
    // Chiudere la connessione al database
    await mongoose.connection.close();
    console.log("Connessione al database chiusa");
  }
}

// Eseguire la funzione
clearSessions();
