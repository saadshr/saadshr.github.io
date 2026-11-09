# Portfolio de Saad Sahraoui

Portfolio d’un étudiant ingénieur à l’ENSAM Rabat, spécialisé en data science, intelligence artificielle et santé digitale (INDIA). Le site présente mes projets en machine learning, en vision par ordinateur et en développement web, ainsi que mon parcours et mon CV.

[Voir le portfolio en ligne](https://saadshr.github.io/) · [Télécharger le CV (PDF)](saad_sahraoui_cv.pdf) · [LinkedIn](https://www.linkedin.com/in/saad-sahraoui/)

## Projets à la une

### Gripper Vision AI

Prototype développé lors de mon stage d’initiation chez Eurostyle Systems à Tanger à l’été 2026. À partir d’une photo de pièce plastique injectée, OpenCV isole le contour et en extrait des caractéristiques géométriques. Une forêt aléatoire propose un type de préhenseur, et l’interface Streamlit affiche la suggestion avec la segmentation pour permettre un contrôle visuel.

[Dépôt Gripper Vision AI](https://github.com/saadshr/gripper-vision-ai)

### Customer Segmentation

Projet réalisé avec Hassan El Hajjam dans le cadre du module Machine Learning 2 à l’ENSAM Rabat. L’étude compare K-Means, la classification hiérarchique de Ward et DBSCAN sur les dépenses de 440 clients du jeu de données UCI Wholesale Customers. Parmi les configurations testées, K-Means à deux groupes offre le meilleur compromis avec un score de silhouette de 0,2903 sur l’ensemble des clients. Le dépôt contient les notebooks, les résultats et le rapport.

[Dépôt Customer Segmentation](https://github.com/saadshr/ml2-customer-segmentation)

## Aperçu en local

Le portfolio utilise HTML, CSS et JavaScript natifs. Avec Git et Python 3 installés, lancer les commandes suivantes depuis PowerShell.

```powershell
git clone https://github.com/saadshr/saadshr.github.io.git
cd saadshr.github.io
python -m http.server 8000 --bind 127.0.0.1
```

Ouvrir ensuite [l’aperçu local](http://127.0.0.1:8000/).

## Organisation du dépôt

- `index.html` contient le profil, les compétences, les projets et les coordonnées.
- `style.css` définit la mise en page et son adaptation aux petits écrans.
- `script.js` gère les animations et le lien de navigation actif.
- `profile.png` et `saad_sahraoui_cv.pdf` sont la photo de profil et le CV téléchargeable.

Le site est hébergé sur GitHub Pages à partir de ce dépôt.
