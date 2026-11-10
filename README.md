# La pubblicità ha due lingue

Sito editoriale che mette a confronto due modi opposti di fare pubblicità: il **teaser Rolls-Royce Ghost (2020)**,
mitico e silenzioso, e le **pubblicità di Taffo Funeral Services**, che ridono della morte. Le due campagne sono
analizzate con retorica, semiotica e il quadrato di Floch.

La parte Rolls-Royce viene da `ricerca.md`; la parte Taffo da fonti giornalistiche e dal sito ufficiale. Differenze e punti da controllare sono in [VERIFICHE.md](VERIFICHE.md).

## Struttura

```
index.html  style.css  script.js  .nojekyll
assets/
  img/campagne/rolls-royce/   fotogrammi del teaser
  img/campagne/taffo/         annunci Taffo e mascotte Tanuba
  img/ai/                     illustrazioni della sezione teorica (SVG)
  img/grafiche/               favicon
  fonts/                      Cormorant Garamond, Inter, Anton (licenza SIL OFL)
```

## Avvio in locale

```bash
python -m http.server 4173
```

Poi apri http://localhost:4173

## Comandi durante l'esposizione

| Comando | Effetto |
| --- | --- |
| Tasto **P** o pulsante **Presenta** | Avvia o chiude la presentazione a schermo intero |
| Frecce, barra spaziatrice, PagSu/PagGiù | Slide successiva o precedente |
| Home / Fine | Prima o ultima slide |
| Esc | Esce e torna alla slide raggiunta |
| Clic su un'immagine | Ingrandisce; clic di nuovo per lo zoom; frecce per scorrere |
| Trascina la linea argento in home (o frecce con il focus) | Sposta il confine: il titolo cambia carattere |
| Clic sulle schede del quadrato di Floch | Evidenzia l'angolo corrispondente |

## Aggiornare il sito online

Il sito è su GitHub Pages dal repository `ScapKiz/RollceTaffo`. Per cambiare un file: nel repository clicca
**Add file → Upload files**, trascina i file modificati e clicca **Commit changes**. Dopo un paio di minuti
ricarica il sito con Ctrl+F5.

## Immagini che puoi aggiungere

| Dove | Cosa serve |
| --- | --- |
| Taffo, «Anche per strada» | Le foto del manifesto di Carnevale 2016, del cartellone «Se guidi, non bere» e del post sulle discoteche chiuse. Le trovi sui profili ufficiali di Taffo (Facebook, Instagram) |
| Rolls-Royce | Le foto ufficiali della Ghost 2020 dal PressClub Rolls-Royce |

## Crediti

- Fotogrammi del teaser Ghost: © Rolls-Royce Motor Cars / Imagination / Cath Elliott
- Annunci Taffo: © Taffo Funeral Services; immagini pubblicate da Open (2019)
- Mascotte Tanuba: © Taffo / Tanuba Funeral Services, sito ufficiale
- Video: incorporato da Vimeo (Cath Elliott)
- Progetto scolastico a scopo didattico, non affiliato ai marchi citati
