# Cirillo Student House

Sito vetrina locale per la casa in zona Ardeatina, a Roma, adattato dal design BuildEstate scelto.
React + Vite + Tailwind + Framer Motion + Three.js; Node e le dipendenze girano in Docker.
Nessun deploy, servizio cloud, account o invio di email viene attivato dal progetto.

## Aprire il sito su Windows

1. Avvia Docker Desktop in modalità container Linux.
2. Fai doppio clic su **menu.cmd**.
3. Premi **1** per Cirillo, **2** per il frontend originale BuildEstate o **3** per entrambi.
4. Il programma costruisce le immagini, attende che i siti siano pronti e apre il browser.
5. Premi **4**, **5** o **6** per spegnere rispettivamente Cirillo, BuildEstate o entrambi.
6. Premi **0** per uscire dal menu: i siti avviati rimangono accesi.

Cirillo: http://localhost:5173 — BuildEstate originale: http://localhost:5174.
Il menu sostituisce i precedenti avvia.cmd, ferma.cmd e compila.cmd.
Le opzioni **8** e **9** mostrano stato dei container e messaggi recenti.
Puoi premere direttamente un numero senza Invio.

Il riferimento deve rimanere in `../other/Real-Estate-Website-windows`.
La prima repository conserva testi, immagini e prezzi dimostrativi originali per confrontarne il design:
non sono dati della casa. Si avvia solo il frontend; autenticazione, ricerca AI,
annunci da database e invio dei moduli richiedono il backend originale e non sono attivi.
Le richieste API della copia vengono fermate localmente con un errore esplicito.

Il primo avvio richiede Internet per scaricare immagine e pacchetti. Non serve installare Node su Windows.
La porta è accessibile solo dal PC: non è una pubblicazione e non è accessibile dal telefono in Wi-Fi.
Se una delle porte 5173 e 5174 è occupata, ferma il servizio che la usa oppure modifica insieme porta, menu e URL.
Le modifiche in `src` e `public` si aggiornano durante lo sviluppo; usa nuovamente l'opzione di avvio dopo modifiche alle dipendenze.
Chiudere il browser non ferma i container.

L'opzione **7** del menu crea in `dist` i file statici di Cirillo; non li pubblica.
In terminale: `docker compose exec web npm run build` verifica la compilazione nel container;
`docker compose logs web` mostra i messaggi del server.

## Cosa comprende

- Presentazione della casa e della ristrutturazione nello stile BuildEstate.
- Hero adattata dal componente originale, caratteri Fraunces/Manrope, toni crema e terracotta,
  immagini grandi, schede asimmetriche, testata fissa e animazioni rispettose del movimento ridotto.
- Eliminati prezzi, autenticazione, pannelli utente, ricerca e contenuti AI dalla versione Cirillo.
- Quattro camere filtrabili, con ipotesi di due singole e due doppie (da confermare).
- Pianta 2D selezionabile e modello 3D dimostrativo ruotabile e ingrandibile.
- Selezione sincronizzata fra pianta, modello, scheda della camera e modulo.
- Guida del quartiere predisposta, senza inventare servizi, distanze o tempi.
- Domande frequenti su disponibilità, contratto e posizione.
- Modulo dimostrativo con validazione; nessun dato inviato o conservato.
- Layout responsive, tastiera, stati di focus, movimento ridotto e alternativa al 3D.

Non vengono mostrati prezzi né promessi prezzi futuri: l'eventuale pubblicazione sarà una scelta successiva.
Il nome “Cirillo” riprende il nome della cartella esistente: è una proposta modificabile.
Le foto provvisorie provengono dal template e sono etichettate esplicitamente.
Le immagini e il modello NON rappresentano la casa reale. Nessun prezzo, metratura,
dotazione, numero di bagni o data di disponibilità è promesso.
Il 3D è caricato solo quando richiesto e renderizza su interazione, non continuamente.

## Dove cambiare le informazioni

- `src/content.js`: marchio, contatti, camere e domande frequenti.
- `src/main.jsx`: sezioni, testi editoriali e selezione condivisa delle camere.
- `src/components/HeroSection.jsx`: componente iniziale adattato da BuildEstate.
- `src/design`: caratteri e tema del template.
- `src/assets`: foto provvisorie del template, da sostituire con foto reali.
- `src/styles.css`: colori, impaginazione e adattamento mobile.
- `src/House3D.jsx`: geometria concettuale e interazione 3D.

`phone` ed `email` sono vuoti. Inserendo il numero compare il collegamento per chiamare.
Inserendo l'email il modulo prepara un messaggio nel programma di posta del visitatore:
NON raccoglie automaticamente contatti e NON conferma un invio.
Per una vera richiesta di ricontatto, EmailJS è una soluzione compatibile con questa base statica:
modulo nel browser → EmailJS → casella email del proprietario → risposta normale via email.
Non serve gestire un proprio backend né un database di contatti.
Il frontend scelto è ora BuildEstate adattato; l'invio EmailJS non è ancora collegato.
Per attivarlo serviranno un servizio email collegato, un template e la public key EmailJS.
Il destinatario va fissato nel template e il Reply-To impostato all'email del visitatore.
Configurare domini consentiti e protezione antispam, spiegando nel modulo il trattamento dei dati.
La public key può essere nel frontend; password email e chiavi private no.
Documentazione: https://www.emailjs.com/docs/introduction/how-does-emailjs-work/
Non inserire segreti o credenziali nel frontend.

## Come farlo crescere

1. Confermare nome e identità, distribuzione delle camere e planimetria.
2. Sostituire lo schema con un modello GLB ottimizzato ricavato da misure reali.
   Collegare ogni camera a un identificativo, mantenendo l'alternativa 2D.
   Un tour fotografico 360° è un'esperienza diversa e richiederà riprese dopo i lavori.
3. Aggiungere foto reali, misure, arredi e dotazioni confermate.
4. Verificare servizi del quartiere e tragitti dai punti reali, pubblicando solo la zona.
5. Definire contratto e disponibilità; decidere separatamente se mostrare i prezzi.
6. Collegare contatti reali e, se serve, un servizio di raccolta richieste.
7. Scegliere hosting e dominio, poi pubblicare.

Per più immobili si potrà passare dall'attuale oggetto `house` a un catalogo,
riutilizzando le schede delle camere e i relativi modelli. Gestione disponibilità,
prenotazioni e pagamenti richiederanno servizi dedicati.

## GitHub Pages e hosting

Il sito produce file statici; `base: './'` e navigazione per ancore consentono
di servirlo anche in una sottocartella senza regole di routing del server.
GitHub Pages non esegue un backend per conservare email o gestire prenotazioni.

Il fatto che un sito sia una vetrina senza pagamenti è distinto dalla regola d'uso:
GitHub limita Pages per gestire attività online o siti orientati principalmente a facilitare transazioni commerciali.
La pagina dei limiti non dà un'esenzione esplicita per tutte le vetrine commerciali.
Non è corretto affermare che ogni sito che menziona un'attività sia automaticamente vietato,
né garantire l'idoneità solo perché manca un pagamento online.
Per una vetrina che promuove affitti e raccoglie richieste, chiarire l'idoneità con GitHub prima del lancio,
oppure scegliere un hosting le cui condizioni ammettano esplicitamente l'uso.
La scelta può attendere: il codice rimane su GitHub e l'output statico è portabile.
Non è stato aggiunto alcun workflow di deploy.
Il meta `noindex,nofollow` è intenzionale per questa anteprima: rivederlo al lancio.

Fonti:
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- https://vite.dev/guide/static-deploy.html

## Perché il clone del riferimento fallisce su Windows

Nella copia locale di `AAYUSH412/Real-Estate-Website` il database Git è presente,
ma il checkout non è stato completato. Due file hanno nomi non validi su Windows:

```text
frontend/src/images/Map:Location.jpg
frontend/src/images/Newsletter : Abstract.jpg
```

Il carattere `:` è il problema; non mancano Node o librerie e la dimensione
non spiega questo errore di checkout. Un clone superficiale non risolve quei nomi.
Non disabilitare `core.protectNTFS` per tentare di aggirare il problema.

È stata preparata una copia di riferimento in `../other/Real-Estate-Website-windows`,
con i due file e relativi riferimenti rinominati. È un'esportazione, non un nuovo clone:
la cartella Git originale è rimasta invariata. Lo script `../other/recupera-template.ps1`
documenta il recupero e rifiuta di sovrascrivere una destinazione esistente.
Per lavorare direttamente sull'originale si può usare un filesystem Linux reale
(volume Docker o filesystem di WSL, non un bind mount Windows), oppure correggere
i nomi in un fork e poi clonarlo su Windows.

La prima repository contiene frontend React, backend e pannello amministrativo.
La seconda è un tema per October CMS e non una moderna app React pronta per Pages.
L'adattamento Cirillo riusa la presentazione di BuildEstate senza portare nel sito
backend, autenticazione o moduli AI. Non dipende dalla cartella del template per avviarsi.
La licenza MIT originale è conservata in `licenses/BuildEstate-MIT.txt`.
Le fotografie sono mantenute come segnaposto per questa anteprima locale: sostituirle
con foto proprie prima del lancio; la licenza del codice non documenta separatamente
i diritti sulle singole foto.

La proposta iniziale è conservata come copia dei sorgenti in `../other/cirillo-first-proposal`.
Il menu continua a gestire Cirillo adattato sulla porta 5173 e BuildEstate originale sulla 5174.
