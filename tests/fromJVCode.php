<!doctype html>
<meta charset="utf-8">
<style>
textarea {
  width: 100%;
  height: 200px;
}
</style>
<script src="https://code.jquery.com/jquery-1.11.2.min.js"></script>
<script src="../src/jvcode.js"></script>

<?php

$txt = isset($_POST['txt']) ? $_POST['txt'] : 0;
$txt_js = isset($_POST['txt_js']) ? $_POST['txt_js'] : 0;
?>


<form action="" method="post">

<?php if($txt || $txt_js):
  $data = $txt ? $txt : $txt_js;
  $url = 'http://www.jeuxvideo.com/jvcode/forums.php';
  
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, ['texte' => $data]);
  curl_setopt($ch, CURLOPT_COOKIE, 'coniunctio=1926178$1429282272$353f440b9515550a2204b7c6297d98f0');
  $rep = curl_exec($ch);

  if($txt_js) {
    die('<div id="rep">' . $rep . '</div>');
  }

  $m = $rep;
?>
  <textarea name="txt" id="txt"><?= $data ?></textarea>
  <div id="labase"><?= $m ?></div>
  <script>
  $(document).ready(function() {
    var s = toJVCode($('#labase').html())
    $('body').append($('<textarea id="txt-post">' + s + '</textarea>'))
    var e = $('<div>').html(s); s = e[0].childNodes[0].nodeValue
    $.post('/tests.php', {txt_js: s}, function(d) {
      d = $(d).find('#rep').html()
      $('body').append($('<div id="post">' + d + '</div>'))
      if($('#labase').html() !== d)
        alert('error')
    })
  })
  </script>
<?php else: ?>
    <textarea name="txt"></textarea>
<?php endif; ?>

  <input type="submit">
</form>