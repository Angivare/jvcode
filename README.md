# jvcode

`toJVCode(el)` prend un objet JQuery en entrée, et convertit le code HTML contenu en jvcode

Attention: deux textes en jvcode différents peuvent donner la même sortie en HTML. Ainsi, un passage `jvcode -> html -> jvcode` ne donnera pas forcément le même jvcode qu'au départ, mais un passage `jvcode -> html -> jvcode -> html` donnera le même code html au début comme à la fin
