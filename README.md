# Portfolio de Grace Tiokam (v4)

Site statique bilingue EN / DE (HTML, CSS, JavaScript). Pas de compilation, pas de dépendance.

## Fichiers
- `index.html` : toute la page, avec le texte anglais (source)
- `assets/css/style.css` : styles (thème clair / sombre)
- `assets/js/i18n-de.js` : toutes les traductions allemandes
- `assets/js/app.js` : navigation, langue, thème, bouton de copie
- `assets/img/` : images (`nf-concept.jpg` et `cm-cover.jpg` sont de nouveaux visuels)
- `src-visuals/` : sources HTML des deux nouveaux visuels (facultatif, non utilisé par le site)

## Tester en local
Ouvrir `index.html` dans un navigateur, ou lancer `python3 -m http.server` dans ce dossier puis ouvrir http://localhost:8000.

## Modifier un texte
1. Le texte anglais se change directement dans `index.html`.
2. Le texte allemand correspondant se change dans `assets/js/i18n-de.js`, avec la même clé (`data-i18n="clé"`).
3. Pour un nouveau texte : ajouter `data-i18n="ma.cle"` à l'élément, puis `"ma.cle": "Texte allemand"` dans `i18n-de.js`.
   Pour une image : `data-i18n-alt`. Pour un `aria-label` : `data-i18n-aria`.

## Publier sur GitHub Pages
1. Créer un dépôt public nommé `GraceTiokam.github.io` (adapter au nom d'utilisateur GitHub).
2. Envoyer tout le contenu de ce dossier à la racine du dépôt, branche `main` (Add file > Upload files, puis Commit).
3. Dépôt > Settings > Pages > Source : « Deploy from a branch », branche `main`, dossier `/ (root)`.
4. Après une ou deux minutes, le site est en ligne à https://GraceTiokam.github.io.

## Adresses directes
- `#projects`, `#about`, `#contact`
- `#campus-guide`, `#netflix`, `#cameroon`, `#student-guide`
- `#campus-guide/user-research`, `#netflix/usability-test`, etc. (section précise d'une étude de cas)
- `?lang=de` ouvre le site en allemand.
