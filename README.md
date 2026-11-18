# Drum Master — version web

Méthode de batterie interactive : théorie, stick control, grooves sur tout le kit, Drum Hero, coach de tempo.

- Appli : https://grosjeje3123.github.io/drum-master-web/
- Archive de l'ancienne version Godot : `godot/`
- Page de test de précision au clic (clavier, écran, MIDI) : `proto/`

Drum Hero lit aussi les tablatures de l'utilisateur : le fichier reste sur l'appareil. Guitar Pro et MIDI ont été essayés ; MusicXML et Capella sont lus par alphaTab mais pas encore vérifiés sur de vrais fichiers.
Un défi se partage par lien : morceau, difficulté, tempo et score à battre.

Fonctionne au clavier, à l'écran tactile ou avec une batterie électronique branchée en MIDI : Chrome, Edge ou Samsung Internet, et Firefox sur ordinateur. Pas sur iPad : Safari ne gère pas le MIDI.
L'écran « Batterie MIDI » règle chaque pad en le frappant (table gardée pour chaque batterie) et montre tout ce que la batterie envoie.
Le MIDI n'a été essayé qu'avec une batterie simulée dans Chrome sur ordinateur, pas encore avec une vraie batterie.

Toute l'appli est enregistrée sur l'appareil dès la première visite, pour jouer hors connexion.
Progression, records et morceaux importés restent sur l'appareil ; Réglages permet d'en faire une sauvegarde et de la restaurer.

Sons : kit Gretsch enregistré par bigjoedrummer et shpira, licence CC0 (voir `sons/CREDITS.txt`).
Police : Archivo, licence SIL OFL (voir `fonts/OFL-Archivo.txt`).
Lecture des fichiers Guitar Pro : alphaTab, licence MPL-2.0 (voir `LICENCES.txt`).
