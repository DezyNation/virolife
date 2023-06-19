<?php
$target = "/home/tfmykjycoxux/public_html/api.virolife.in";
$link = "/home/tfmykjycoxux/virolife_backend/storage/app/campaign_assets";
symlink($target, $link);
echo "true";
?>