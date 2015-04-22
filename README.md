# jvcode

Nécessite JQuery

`JVCode.toJVCode(str)` prend du code HTML et le convertit en jvcode (avec caractères html littéraux!)

Attention: deux textes en jvcode différents peuvent donner la même sortie en HTML. Ainsi, un passage `jvcode -> html -> jvcode` ne donnera pas forcément le même jvcode qu'au départ, mais un passage `jvcode -> html -> jvcode -> html` donnera le même code html au début comme à la fin

tests.php fournit une page où on peut entrer du JVCode, et seront affichées les différentes étapes `jvcode -> html -> jvcode -> html` à partir de notre entrée. Si la sortie HTML du code d'entrée et du code fourni par JVCode ne correspondent pas, une boîte de dialogue sera affichée (mais bon ça devrait pas arriver :-D)
