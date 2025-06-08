# 📊 Complexité cyclomatique dans les projets VB6

## 🔍 Qu’est-ce que la complexité cyclomatique ?

La complexité cyclomatique est une **mesure du nombre de chemins d'exécution indépendants** dans un programme. Elle permet d'évaluer la **complexité logique** du code source.

Elle a été introduite par Thomas J. McCabe en 1976 comme un indicateur de :

- maintenabilité du code,
- effort de test nécessaire (nombre de cas de test minimaux),
- lisibilité et fiabilité.

---

## 🧮 Formule générale

```text
Complexité = Nombre de décisions + 1
```

Une "décision" est toute construction conditionnelle qui change le flot du programme (comme un `If`, `While`, etc.).

---

## 🧠 Pourquoi c’est utile en VB6 ?

Même si VB6 est un langage ancien, beaucoup d’applications critiques sont encore basées sur cette technologie. Mesurer sa complexité cyclomatique permet de :

- localiser les fonctions difficiles à maintenir,
- prioriser les refactorings,
- dimensionner l'effort de test.

---

## ⚙️ Comment est-elle mesurée dans ce projet ?

Le calcul est basé sur une analyse statique des fichiers suivants :

- `.bas` (Modules)
- `.cls` (Classes)
- `.frm` (Formulaires)

Le script parcourt les fichiers et **compte les instructions de contrôle** comme :

| Instruction VB6         | Interprétation      |
| ----------------------- | ------------------- |
| `If`, `ElseIf`          | Condition           |
| `For`, `Do`, `While`    | Boucle              |
| `Select Case`           | Décision multiple   |
| `On Error GoTo`, `GoTo` | Saut inconditionnel |

---

## 🧪 Exemple de calcul

```vb
If a > 0 Then
  For i = 1 To 10
    If b = 5 Then
      Do While c < 100
        c = c + 1
      Loop
    End If
  Next i
End If
```

Ce bloc de code contient :

- `If` : 2
- `For` : 1
- `Do While` : 1

**→ Complexité cyclomatique = 4 (décisions) + 1 = 5**

---

## 📁 Résultat dans le rapport

Chaque analyse retourne un objet comme :

```json
{
  "repo": "[local] projetVB",
  "language": "VB6",
  "sizeInKB": 15,
  "complexity": 12,
  "source": "local"
}
```

> La taille (`sizeInKB`) est également mesurée pour donner une idée du poids physique du code.

---

## 🛠️ Limitations

- Le comptage est approximatif (par pattern, pas par parsing complet).
- Ne tient pas compte de la portée ni des conditions imbriquées.
- Ne distingue pas les commentaires.

---

## ✅ Conclusion

Mesurer la complexité cyclomatique des projets VB6 aide à :

- détecter les modules à risque,
- améliorer la qualité logicielle,
- optimiser les efforts de test ou de migration.

---
